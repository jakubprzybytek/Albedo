import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';
import { formatHourAngle, formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  paper: {
//    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export default function EphemerisCharts(props) {

  const { ephemerides } = props;

  function createOptions(ephemerides) {
    return {
      stroke: {
        curve: 'straight'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ephemerides.map(ephemeris => ephemeris.jde),
        type: "datetime"
      },
      yaxis: {
        reversed: true
      }
    };
  }
  
  function createSeries(ephemerides) {
    return [{
      name: "Apparent brightness [mag]",
      data: ephemerides.map(ephemeris => ephemeris.apparentMagnitude) 
    }];
  }

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Chart options={createOptions(ephemerides)} series={createSeries(ephemerides)} type="line" />
    </Paper>
  );
}
