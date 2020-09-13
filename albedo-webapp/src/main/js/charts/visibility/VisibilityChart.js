import React from 'react';
import differenceInDays from 'date-fns/differenceInDays'

function scaleFactory(startingDayString, centerAt) {
  const startingDay = new Date((startingDayString || "").substr(0,10));
  const maxMinutes = ((centerAt + 12) % 24) * 60;
  return dateTime => {
    const minutes = parseInt(dateTime.substr(11, 2)) * 60 + parseInt(dateTime.substr(14, 2));
    const x = minutes <= maxMinutes ? minutes + 720 : minutes - 720;
    const y = 5 + (differenceInDays(new Date(dateTime), startingDay) + (minutes <= maxMinutes ? -1 : 0)) * 4;
console.log("dt: " + dateTime + " p:[" + x + "," + y + "]");
    return [x, y];
  }
}

function toPoints(localTimes, scale, reverse) {
  const points = [];
  
  for (var i = 0; i < localTimes.length; i++) {
    const point = scale(localTimes[i]);
    points.push("" + point[0] + "," + point[1]);
  }

  return (reverse ? points.reverse() : points).join(' ');
}

const CONTINUITY_LIMIT_MS = 1000 * 60 * 60 * 24 * 2;

function splitContinuesTimeSeries(timeSeries) {
  const allSeries = [];
  var continousSeries = [];
  
  for (const localDateTime of timeSeries) {
    if (continousSeries.length == 0) {
      continousSeries.push(localDateTime);
    } else {
      // continuity test
      if (Date.parse(localDateTime) - Date.parse(continousSeries[continousSeries.length - 1]) < CONTINUITY_LIMIT_MS) {
        continousSeries.push(localDateTime);
      } else {
        allSeries.push(continousSeries);
        continousSeries = [ localDateTime ];
      }
    }
  }

  allSeries.push(continousSeries);

  return allSeries;
}

function VisibilityArea(props) {

  const { sets, raises, scale, style } = props;

  const splitSets = splitContinuesTimeSeries(sets);
  const splitRaises = splitContinuesTimeSeries(raises);

  return (<g style={style}>
    {splitSets.map((continuousSetSeries, index) => (
      <polygon key={index} points={toPoints(continuousSetSeries, scale, false) + " " + toPoints(splitRaises[index], scale, true)} /> 
    ))}
  </g>);
}

export default function VisibilityChart(props) {

  const { visibilityChartData } = props;

  const scale = scaleFactory(visibilityChartData.sunSets[0], 0);

  return (
    <svg width="100%" height="100%">
      {/*<VisibilityArea sets={visibilityChartData.sunSets} raises={visibilityChartData.sunRises} scale={scale} style={{fill:'lightYellow', stroke:'yellow', strokeWidth: 1}} />
      <VisibilityArea sets={visibilityChartData.sunCivilDusks} raises={visibilityChartData.sunCivilDawns} scale={scale} style={{fill:'lightGrey', stroke:'grey', strokeWidth: 1}} />
      <VisibilityArea sets={visibilityChartData.sunNauticalDusks} raises={visibilityChartData.sunNauticalDawns} scale={scale} style={{fill:'grey', stroke: 'blue', strokeWidth: 1}} />
  */}
      <VisibilityArea sets={visibilityChartData.sunAstronomicalDusks} raises={visibilityChartData.sunAstronomicalDawns} scale={scale} style={{fill:'dimgrey', stroke: 'black', strokeWidth: 1}} />
    </svg>
  );
}