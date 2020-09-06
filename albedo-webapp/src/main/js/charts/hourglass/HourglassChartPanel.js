import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function HourglassChartPanel() {

  const [altitudesResponse, setAltitudesResponse] = React.useState({ timeSeries: [], altitudeSeries: [], sunRiseTransitSetEvents: [] });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.area}>
      </div>
      <div className={classes.area}>
        Hello
      </div>
    </div>
  );
}