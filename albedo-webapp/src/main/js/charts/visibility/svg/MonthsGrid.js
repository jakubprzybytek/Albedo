import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toPoints } from '../VisibilityChart';
import { setDate, addMonths, differenceInDays, format } from 'date-fns';

const useStyles = makeStyles(theme => ({
  root: {
    stroke: 'lightgrey',
    strokeWidth: 1,
    strokeOpacity: 0.4,
    "&:hover": {
      strokeOpacity: 1.0,
    },
  },
  label: {
    stroke: 'grey',
    strokeWidth: 0.5,
    strokeOpacity: 1.0,
  },
  axis: {
    strokeDasharray: "2,5",
  },
}));


export default function MonthsGrid(props) {

  const { firstDateString, lastDateString, sunSetsMap, scale } = props;

  const classes = useStyles();

  const firstDate = new Date(firstDateString);
  const firstMonth = addMonths(setDate(firstDate, 1), 1);
  const lastMonth = addMonths(setDate(new Date(lastDateString), 1), 1);
  const months = [];
  for (var month = firstMonth; month < lastMonth; month = addMonths(month, 1)) {
    months.push(month);
  }

  const monthLabels = months.map(monthDate => [monthDate, differenceInDays(monthDate, firstDate)]);

  return (<g className={classes.root}>
    {monthLabels.map((monthLabel, index) => (
      <React.Fragment key={index}>
        <text x={sunSetsMap[monthLabel[1]] - 20} y={scale.y(monthLabel[1])} fill="grey" textAnchor="end" dominantBaseline="hanging" className={classes.label}>{format(monthLabel[0], 'MMMM yyyy')}</text>
        <polyline points={toPoints([[ 0, monthLabel[1]], [1000, monthLabel[1]] ], scale, false)} className={classes.axis} />
      </React.Fragment>
    ))}
  </g>);
}
