import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chart from 'react-apexcharts';
  
const useStyles = makeStyles(theme => ({
  root: {
  }
}));

const annotationColours = {
  'Setting':          '#80a080',
  'CivilDusk':        '#505080',
  'NauticalDusk':     '#202080',
  'AstronomicalDusk': '#202020',
  'AstronomicalDawn': '#202080',
  'NauticalDawn':     '#505080',
  'CivilDawn':        '#80a080',
  'Raising':          '#e0d0c0',
  'Transit':          '#e0d0c0',
};

export default function NightChartPanel(props) {

  const { altitudesResponse } = props;

  const classes = useStyles();

  const stripTime = function (localDateTime) {
    return localDateTime.substr(localDateTime.indexOf('T') + 1, 8);    
  }

  const createAnnotations = function (sunRiseTransitSetEvents) {
    var annotations = [];
    for (var i = 0; i < sunRiseTransitSetEvents.length - 1; i++) {
      annotations.push({
        x: new Date(sunRiseTransitSetEvents[i].localTime).getTime(),
        x2: new Date(sunRiseTransitSetEvents[i+1].localTime).getTime(),
        fillColor: annotationColours[sunRiseTransitSetEvents[i].eventType],
        opacity: 0.3,
        label: {
          borderColor: '#5050a0',
          style: {
            fontSize: '16px',
            color: '#fff',
            background: '#404080',
          },
          offsetY: -10,
          text: sunRiseTransitSetEvents[i].eventType + " " + stripTime(sunRiseTransitSetEvents[i].localTime),
        }
      });
    }
    return annotations;
  }

  const state = {
    series: altitudesResponse.altitudeSeries.map(bodyAltitudes => { return {
      name: bodyAltitudes.bodyDetails.name,
      data: bodyAltitudes.altitudes,
    }}),
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: true
        },
      },
      annotations: {
        xaxis: createAnnotations(altitudesResponse.sunRiseTransitSetEvents),   
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Bodies Altitude',
        align: 'center'
      },
      
      xaxis: {
        type: 'datetime',
        categories: altitudesResponse.timeSeries,
      },
      yaxis: {
        min: 0,
        max: 60,
        tickAmount: 12,
        title: {
          text: "Altitude [°]",
        }
      },
    },
  };

  return (
    <Paper className={classes.root}>
      <Chart options={state.options} series={state.series} type="line" height={1000} />
    </Paper>
  );
}