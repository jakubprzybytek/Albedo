import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chart from 'react-apexcharts';
  
const useStyles = makeStyles(theme => ({
  root: {
  }
}));

const annotationColours = {
  'Setting':          '#e0a0a0',
  'CivilDusk':        '#a0a060',
  'NauticalDusk':     '#4040a0',
  'AstronomicalDusk': '#505050',
  'AstronomicalDawn': '#4040a0',
  'NauticalDawn':     '#a0a060',
  'CivilDawn':        '#e0a0a0',
  'Raising':          '#e0d0c0',
  'Transit':          '#e0d0c0',
};

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
    if (sunRiseTransitSetEvents.length > 0) {
      annotations.push({
        x: new Date(sunRiseTransitSetEvents[sunRiseTransitSetEvents.length - 1].localTime).getTime(),
        label: {
          borderColor: '#5050a0',
          style: {
            fontSize: '16px',
            color: '#fff',
            background: '#404080',
          },
          offsetY: -10,
          text: sunRiseTransitSetEvents[sunRiseTransitSetEvents.length - 1].eventType + " " + stripTime(sunRiseTransitSetEvents[sunRiseTransitSetEvents.length - 1].localTime),
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
          enabled: false
        },
      },
      colors: altitudesResponse.altitudeSeries.map(bodyAltitudes => bodyAltitudes.bodyDetails.name in seriesColours ? seriesColours[bodyAltitudes.bodyDetails.name] : '#808080' ),
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
        categories: altitudesResponse.timeSeries, //.map(datetime => datetime.substr(0, 19)),
        labels: {
          datetimeUTC: false,
        }
      },
      yaxis: {
        min: 0,
        max: 60,
        tickAmount: 12,
        title: {
          text: "Altitude [°]",
        }
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