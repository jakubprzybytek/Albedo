import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toPoints } from '../VisibilityChart';

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


export default function HourGrid(props) {

  const { scale, centerAt } = props;

  const classes = useStyles();

  const hours = [];
  for (var i = 0; i < 20; i++) {
    hours.push(2 + i);
  }

  return (<g className={classes.root}>
    {hours.map(hour => (
      <React.Fragment>
        <text x={scale.x(hour * 60)} y="15" fill="grey" className={classes.label}>{(hour + 12 + centerAt) % 24}:00</text>
        <polyline points={toPoints([ [hour * 60, 0], [hour * 60, 200] ], scale, false)} className={classes.axis} />
      </React.Fragment>
    ))}
  </g>);
}
