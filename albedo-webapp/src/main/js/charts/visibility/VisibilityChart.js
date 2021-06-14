import React from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import NightContour from './svg/NightContour';
import BodyVisibilityPath from './svg/BodyVisibilityPath';
import HourGrid from './svg/HourGrid';
import MonthsGrid from './svg/MonthsGrid';

export function scaleFactory(timePoints, height, yOffset) {
  const yMultiplier = timePoints <= height ? height / timePoints : height / timePoints;
  return {
    x: x => x,
    y: y => y * yMultiplier + yOffset,
  };
}

export function toPoints(timePoints, scale, reverse) {
  const points = [];
  
  for (var i = 0; i < timePoints.length; i++) {
    points.push("" + scale.x(timePoints[i][0]) + "," + scale.y(timePoints[i][1]));
  }

  return (reverse ? points.reverse() : points).join(' ');
}

export function arrangeDatesFactory(startingDayString, centerAt) {
  const startingDay = new Date((startingDayString || "").substr(0,10));
  const maxMinutes = ((centerAt + 12) % 24) * 60;
  return dates => {
    return dates.map(dateTime => {
      const minutes = parseInt(dateTime.substr(11, 2)) * 60 + parseInt(dateTime.substr(14, 2));
      const x = minutes <= maxMinutes ? minutes + 720 : minutes - 720;
      const y = differenceInDays(new Date(dateTime.substr(0,10)), startingDay) + (minutes <= maxMinutes ? -1 : 0);
      return [x, y];
    })
  }
}

export default function VisibilityChart(props) {

  const { visibilityChartData } = props;

  const centerAt = 0;
  const scale = scaleFactory(visibilityChartData.sunSets.length, 1000 - 40, 20);
  const arrangeDates = arrangeDatesFactory(visibilityChartData.sunSets[0], centerAt);

  const sunSets = arrangeDates(visibilityChartData.sunSets);
  const sunRises = arrangeDates(visibilityChartData.sunRises);

  const sunSetsMap = {};
  sunSets.forEach(point => sunSetsMap[point[1]] = point[0]);
  const sunRisesMap = {};
  sunRises.forEach(point => sunRisesMap[point[1]] = point[0]);

  return (
    <svg width="100%" height="100%" style={{ backgroundColor: 'lightgrey' }}>
      <NightContour sets={sunSets} raises={sunRises} scale={scale} style={{ fill: '#003399' }} />
      <NightContour sets={arrangeDates(visibilityChartData.sunCivilDusks)} raises={arrangeDates(visibilityChartData.sunCivilDawns)} scale={scale} style={{ fill: '#000099'} } />
      <NightContour sets={arrangeDates(visibilityChartData.sunNauticalDusks)} raises={arrangeDates(visibilityChartData.sunNauticalDawns)} scale={scale} style={{ fill: '#000066' }} />
      <NightContour sets={arrangeDates(visibilityChartData.sunAstronomicalDusks)} raises={arrangeDates(visibilityChartData.sunAstronomicalDawns)} scale={scale} style={{ fill: '#000033' }} />
      {visibilityChartData.bodies.map((body, index) => (
        <BodyVisibilityPath key={index} 
          bodyName={body.bodyDetails.name}
          rises={arrangeDates(body.rises)}
          transits={arrangeDates(body.transits)}
          sets={arrangeDates(body.sets)}
          sunSetsMap={sunSetsMap}
          sunRisesMap={sunRisesMap}
          scale={scale} />
      ))}
      {sunSets.length > 0 && (<React.Fragment>
        <HourGrid centerAt={centerAt} maxY={sunSets[sunSets.length - 1][1]} scale={scale} />
        <MonthsGrid
          firstDateString={visibilityChartData.sunSets[0]}
          lastDateString={visibilityChartData.sunSets[visibilityChartData.sunSets.length - 1]}
          sunSetsMap={sunSetsMap}
          scale={scale} />
      </React.Fragment>)}
    </svg>
  );
}