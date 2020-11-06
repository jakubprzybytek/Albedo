import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chart from 'react-apexcharts';
  
const useStyles = makeStyles(theme => ({
  root: {
  }
}));

const seriesColours = {
  'Sun': '#ffff00',
  'Moon': '#b0b0b0',
  'Mercury': '#6600ff',
  'Venus': '#ff99cc',
  'Mars': '#ff0000',
  'Jupiter': '#33cc33',
  'Saturn': '#ff6600',
  'Neptune': '#0066ff',
  'Uranus': '#33cccc',
}

export default function TransitsChart(props) {

  const { transitsResponse } = props;

  const classes = useStyles();

  const stripTime = function (localDateTime) {
    return localDateTime.substr(localDateTime.indexOf('T') + 1, 8);    
  }

  const state = {
    series: transitsResponse.transitsSeries.map(transitsSeries => { return {
      name: transitsSeries.bodyDetails.name,
      data: transitsSeries.transits,
    }}),
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      colors: transitsResponse.transitsSeries.map(transitsSeries => transitsSeries.bodyDetails.name in seriesColours ? seriesColours[transitsSeries.bodyDetails.name] : '#808080' ),
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Bodies Transits',
        align: 'center'
      },
      xaxis: {
        type: 'datetime',
        categories: transitsResponse.timeSeries,
        labels: {
          datetimeUTC: false,
        }
      },
      yaxis: {
        min: 0,
        max: 70,
        tickAmount: 14,
        title: {
          text: "Altitude [°]",
        }
      },
      annotations: {
        xaxis: [{
          x: new Date().getTime(),
          strokeDashArray: 0,
          borderColor: 'grey',
          label: {
            borderColor: 'grey',
            style: {
              color: '#fff',
              background: 'grey',
            },
            text: 'Today',
          }
        }],
      },
      tooltip: {
        x: {
          format: 'dd MMM HH:mm',
        }
      }
    },
  };

  return (
    <Paper className={classes.root}>
      <Chart options={state.options} series={state.series} type="line" height={1000} />
    </Paper>
  );
}