import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toPoints } from '../VisibilityChart';

const useStyles = makeStyles(theme => ({
  bodyPath: {
    strokeWidth: 3,
    fill: 'none',
    strokeOpacity: 0.6,
    "&:hover": {
      strokeOpacity: 1.0,
    },
  },
  bodyRiseEdge: {
    strokeDasharray: "5,5",
  },
  bodyTransitEdge: {
    strokeOpacity: 1.0,
  },
  bodySetEdge: {
    strokeDasharray: "10,5",
  },
}));

const seriesColours = {
  'Sun': '#ffff00',
  'Moon': '#b0b0b0',
  'Mercury': 'lightgrey',
  'Venus': '#ff99cc',
  'Mars': '#ff0000',
  'Jupiter': '#33cc33',
  'Saturn': '#ff6600',
  'Neptune': '#0066ff',
  'Uranus': '#33cccc',
}

function extractNightEvents(timePoints, sunSetsMap, sunRisesMap) {
  const allSeries = [];
  var currentSeries = [];

  for (const timePoint of timePoints) {
    if (timePoint[0] >= sunSetsMap[timePoint[1]] && timePoint[0] <= sunRisesMap[timePoint[1]]) {
      currentSeries.push(timePoint);
    } else {
      if (currentSeries.length > 0) {
        allSeries.push(currentSeries);
        currentSeries = [];
      }
    }
  }
  
  if (currentSeries.length > 0) {
    allSeries.push(currentSeries);
  }

  return allSeries;
}

export default function BodyVisibilityPath(props) {

  const { bodyName, rises, transits, sets, sunSetsMap, sunRisesMap, scale } = props;

  const classes = useStyles();
  const colour = seriesColours[bodyName] || 'yellow';

  const extractedRiseSeries = extractNightEvents(rises, sunSetsMap, sunRisesMap);
  const extractedTransitSeries = extractNightEvents(transits, sunSetsMap, sunRisesMap);
  const extractedSetSeries = extractNightEvents(sets, sunSetsMap, sunRisesMap);

  return (<g style={{stroke: colour }} className={classes.bodyPath}>
    {extractedRiseSeries.map((series, index) => (
      <polyline key={index} points={toPoints(series, scale, false)} className={classes.bodyRiseEdge} />
    ))}
    {extractedTransitSeries.map((series, index) => (
      <polyline key={index} points={toPoints(series, scale, false)} className={classes.bodyTransitEdge} />
    ))}
    {extractedSetSeries.map((series, index) => (
      <polyline key={index} points={toPoints(series, scale, false)} className={classes.bodySetEdge} />
    ))}
  </g>);
}
