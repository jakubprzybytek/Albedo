import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatHourAngle, formatDegrees, formatArcSeconds } from './../utils/Angles';
import { ElongationChip } from '../components/Chips';
import { LocalDateTimeChip } from '../components/Chips';

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
            <TableCell align="center">Distance f/Sun [AU]</TableCell>
            <TableCell align="center">Distance f/Earth [AU]</TableCell>
            <TableCell align="center">Elongation [°]</TableCell>
            <TableCell align="center">Magnitude</TableCell>
            <TableCell align="right">Size ["]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(ephemeris => (
            <TableRow key={ephemeris.id}>
              <TableCell component="th" scope="row">
                <LocalDateTimeChip time={ephemeris.localTime} jd={ephemeris.jde} />
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
                <ElongationChip elongation={ephemeris.elongation} />
              </TableCell>
              <TableCell align="center">
                {ephemeris.apparentMagnitude}
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
