import React from 'react';
import Paper from '@material-ui/core/Paper';
import Canvas from '../utils/Canvas';
import Chart from 'react-apexcharts';

export default function NightChartPanel(props) {

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 30*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
    ctx.font = "30px Arial";
    ctx.fillText("Hello World " + ctx.canvas.width + " x " + ctx.canvas.height, 10, 50);
  }
  const state = {
          
    series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Body Altitude',
        align: 'center'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    },
  
  
  };

  return (
  <Paper>
    <Chart options={state.options} series={state.series} type="line" height={350} />
    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />

  </Paper>);
}