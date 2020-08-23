import React from 'react';
import Paper from '@material-ui/core/Paper';
import Chart from 'react-apexcharts';

export default function EphemerisCharts(props) {

  const { ephemerisList } = props;

  function createOptions(ephemerisList) {
    return {
      stroke: {
        curve: 'straight'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ephemerisList.map(ephemeris => ephemeris.localTime),
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

  function createSeries(ephemerisList) {
    return [{
      name: 'Apparent brightness [mag]',
      data: ephemerisList.map(ephemeris => ephemeris.apparentMagnitude)
    },{
      name: 'Angular size ["]',
      data: ephemerisList.map(ephemeris => (ephemeris.angularSize * 3600.0).toFixed(2))
    },{
      name: 'Distance from Sun [AU]',
      data: ephemerisList.map(ephemeris => ephemeris.distanceFromSun)
    },{
      name: 'Distance from Earth [AU]',
      data: ephemerisList.map(ephemeris => ephemeris.distanceFromEarth)
    }];
  }

  return (
    <Paper>
      <Chart options={createOptions(ephemerisList)} series={createSeries(ephemerisList)} type="line" />
    </Paper>
  );
}
