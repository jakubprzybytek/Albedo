import React from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import NightContour from './svg/NightContour';
import BodyVisibilityPath from './svg/BodyVisibilityPath';

export function toPoints(timePoints, scale, reverse) {
  const points = [];
  
  for (var i = 0; i < timePoints.length; i++) {
    const point = scale(timePoints[i]);
    points.push("" + point[0] + "," + point[1]);
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

export function scaleFactory(timePoints, height, yOffset) {
  const yMultiplier = timePoints <= height ? height / timePoints : height / timePoints;
  return (point) => {
    const scaledY = point[1] * yMultiplier + yOffset;
    return [point[0], scaledY];
  }
}

export default function VisibilityChart(props) {

  const { visibilityChartData } = props;

  const scale = scaleFactory(visibilityChartData.sunSets.length, 1000 - 10, 5);
  const arrangeDates = arrangeDatesFactory(visibilityChartData.sunSets[0], 0);

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
    </svg>
  );
}