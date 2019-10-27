import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import { formatHourAngle, formatDegrees, formatArcSeconds } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  paper: {
//    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export default function EphemerisTable(props) {

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time [TDE]</TableCell>
            <TableCell align="center">R.A. [hms]</TableCell>
            <TableCell align="center">Dec. [°]</TableCell>
            <TableCell align="center">Distance from Sun [AU]</TableCell>
            <TableCell align="center">Distance from Earth [AU]</TableCell>
            <TableCell align="center">Magnitude</TableCell>
            <TableCell align="right">Size ["]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(ephemeris => (
            <TableRow key={ephemeris.index}>
              <TableCell component="th" scope="row" title={ephemeris.jde}>
                {format(Date.parse(ephemeris.jde), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell align="center" title={ephemeris.coordinates.rightAscension + '°'}>
                {formatHourAngle(ephemeris.coordinates.rightAscension)}
              </TableCell>
              <TableCell align="center" title={ephemeris.coordinates.declination + '°'}>
                {formatDegrees(ephemeris.coordinates.declination)}
              </TableCell>
              <TableCell align="center">
                {ephemeris.distanceFromSun.toFixed(6)}
              </TableCell>
              <TableCell align="center">
                {ephemeris.distanceFromEarth.toFixed(6)}
              </TableCell>
              <TableCell align="center">
                {ephemeris.apparentMagnitude.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {formatArcSeconds(ephemeris.angularSize)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
