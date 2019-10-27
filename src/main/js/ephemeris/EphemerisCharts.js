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
        type: 'datetime',
        title: {
          text: 'TDB'
        }
      },
      yaxis: [{
        seriesName: 'Apparent brightness [mag]',
        showAlways: false,
        decimalsInFloat: 2,
        reversed: true,
        forceNiceScale: true,
        title: {
          text: 'Brightness [Mag]'
        }
      },{
        seriesName: 'Angular size ["]',
        showAlways: false,
        decimalsInFloat: 2,
        forceNiceScale: true,
        title: {
          text: 'Angular size ["]'
        }
      },{
        seriesName: 'Distance from Sun [AU]',
        showAlways: false,
        opposite: true,
        forceNiceScale: true,
        title: {
          text: 'Distance [AU]'
        }
      },{
        seriesName: 'Distance from Sun [AU]',
        show: false
      }]
    }
  };

  const classes = useStyles();

  function createSeries(ephemerides) {
    return [{
      name: 'Apparent brightness [mag]',
      data: ephemerides.map(ephemeris => ephemeris.apparentMagnitude)
    },{
      name: 'Angular size ["]',
      data: ephemerides.map(ephemeris => (ephemeris.angularSize * 3600.0).toFixed(2))
    },{
      name: 'Distance from Sun [AU]',
      data: ephemerides.map(ephemeris => ephemeris.distanceFromSun)
    },{
      name: 'Distance from Earth [AU]',
      data: ephemerides.map(ephemeris => ephemeris.distanceFromEarth)
    }];
  }

  return (
    <Paper className={classes.paper}>
      <Chart options={createOptions(ephemerides)} series={createSeries(ephemerides)} type="line" />
    </Paper>
  );
}
