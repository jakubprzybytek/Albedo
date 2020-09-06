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

  return (
  <Paper>
  </Paper>);
}