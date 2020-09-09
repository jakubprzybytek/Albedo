import React from 'react';

function toPoints(localTimes, delta) {
  const points = [];
  
  for (var i = 0; i < localTimes.length; i++) {
    const minutes = parseInt(localTimes[i].substr(11, 2)) * 60 + parseInt(localTimes[i].substr(14, 2));
    points.push("" + (minutes + delta) + "," + i * 5);
  }

  return points.join(' ');
}

export default function VisibilityChart(props) {

  const { visibilityChartData } = props;

  const settings = visibilityChartData.sunRiseTransitSetEvents
    .filter(rtsEvent => rtsEvent.eventType === 'Setting')
    .map(rtsEvent => rtsEvent.localTime);

  const civilDusks = visibilityChartData.sunRiseTransitSetEvents
    .filter(rtsEvent => rtsEvent.eventType === 'CivilDusk')
    .map(rtsEvent => rtsEvent.localTime);

  const nauticalDusks = visibilityChartData.sunRiseTransitSetEvents
    .filter(rtsEvent => rtsEvent.eventType === 'NauticalDusk')
    .map(rtsEvent => rtsEvent.localTime);

  const astronomicalDusks = visibilityChartData.sunRiseTransitSetEvents
    .filter(rtsEvent => rtsEvent.eventType === 'AstronomicalDusk')
    .map(rtsEvent => rtsEvent.localTime);

  const astronomicalDawns = visibilityChartData.sunRiseTransitSetEvents
    .filter(rtsEvent => rtsEvent.eventType === 'AstronomicalDawn')
    .map(rtsEvent => rtsEvent.localTime);

  const nauticalDawns = visibilityChartData.sunRiseTransitSetEvents
    .filter(rtsEvent => rtsEvent.eventType === 'NauticalDawn')
    .map(rtsEvent => rtsEvent.localTime);

  return (
    <svg width="100%" height="100%">
      <polyline points={toPoints(settings, -720)} style={{fill:'none',stroke:'red',strokeWidth:3}} />
      <polyline points={toPoints(civilDusks, -720)} style={{fill:'none',stroke:'green',strokeWidth:3}} />
      <polyline points={toPoints(nauticalDusks, -720)} style={{fill:'none',stroke:'purple',strokeWidth:3}} />
      <polyline points={toPoints(astronomicalDusks, -720)} style={{fill:'none',stroke:'orange',strokeWidth:3}} />
      <polyline points={toPoints(astronomicalDawns, 720)} style={{fill:'none',stroke:'orange',strokeWidth:3}} />
      <polyline points={toPoints(nauticalDawns, 720)} style={{fill:'none',stroke:'red',strokeWidth:3}} />
    </svg>
  );
}