import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toPoints } from '../VisibilityChart';

const useStyles = makeStyles(theme => ({
  root: {
    stroke: 'lightgrey',
    strokeWidth: 1,
    strokeOpacity: 0.4,
    strokeDasharray: "2,5",
    "&:hover": {
      strokeOpacity: 1.0,
    },
  },
}));


export default function HourGrid(props) {

  const { scale } = props;

  const classes = useStyles();

  return (<g className={classes.root}>
    <text x="0" y="15" fill="grey">0:00</text>
    <polyline points={toPoints([ [660, 0], [660, 200] ], scale, false)} />
    <polyline points={toPoints([ [720, 0], [720, 200] ], scale, false)} />
    <polyline points={toPoints([ [780, 0], [780, 200] ], scale, false)} />
  </g>);
}
