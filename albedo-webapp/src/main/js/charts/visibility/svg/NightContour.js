import React from 'react';
import { toPoints } from '../VisibilityChart';

function extractContinuesTimePoints(timePoints) {
  const allSeries = [];
  var continousSeries = [];
  
  for (const timePoint of timePoints) {
    if (continousSeries.length == 0) {
      continousSeries.push(timePoint);
    } else {
      // continuity test
      if (timePoint[1] - continousSeries[continousSeries.length - 1][1] <= 2) {
        continousSeries.push(timePoint);
      } else {
        allSeries.push(continousSeries);
        continousSeries = [ timePoint ];
      }
    }
  }

  allSeries.push(continousSeries);

  return allSeries;
}

export default function NightContour(props) {

  const { sets, raises, scale, style } = props;

  const splitSets = extractContinuesTimePoints(sets);
  const splitRaises = extractContinuesTimePoints(raises);

  return (<g style={style}>
    {splitSets.map((continuousSetSeries, index) => (
      <polygon key={index} points={toPoints(continuousSetSeries, scale, false) + " " + toPoints(splitRaises[index], scale, true)} /> 
    ))}
  </g>);
}
