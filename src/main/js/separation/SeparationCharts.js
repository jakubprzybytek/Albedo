import React from 'react';
import Paper from '@material-ui/core/Paper';
import Chart from 'react-apexcharts';

export default function SeparationCharts(props) {

  const { rows } = props;

  function createOptions(rows) {
    return {
      stroke: {
        curve: 'straight'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: rows.map(row => row.localTime),
        type: 'datetime',
        title: {
          text: 'TDB'
        }
      },
      yaxis: [{
        seriesName: 'Separation [°]',
        showAlways: false,
        decimalsInFloat: 2,
        forceNiceScale: true,
        title: {
          text: 'Separation [°]'
        }
      }]
    }
  };

  function createSeries(rows) {
    return [{
      name: 'Separation [°]',
      data: rows.map(row => row.separation)
    }];
  }

  return (
    <Paper>
      <Chart options={createOptions(rows)} series={createSeries(rows)} type="line" />
    </Paper>
  );
}
