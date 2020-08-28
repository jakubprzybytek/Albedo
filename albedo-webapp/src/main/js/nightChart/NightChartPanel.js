import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NightChartForm from './NightChartForm';
import NightChart from './NightChart';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function NightChartPanel() {

  const [altitudesResponse, setAltitudesResponse] = React.useState({ altitudeSeries: [], sunRiseTransitSetEvents: [] });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.area}>
        <NightChartForm updateAltitudesResponse={setAltitudesResponse} />
      </div>
      <div className={classes.area}>
        <NightChart altitudesResponse={altitudesResponse} />
      </div>
    </div>
  );
}