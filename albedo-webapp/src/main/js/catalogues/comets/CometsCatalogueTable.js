import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatHourAngle, formatDegrees, formatArcSeconds } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  paper: {
    //    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export default function CometsCatalogueTable(props) {

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Eccentricity</TableCell>
            <TableCell align="center">Semi Major Axis [AU]</TableCell>
            <TableCell align="center">Periapsis [AU]</TableCell>
            <TableCell align="center">Apoapsis [AU]</TableCell>
            <TableCell align="center">Argument of Peryhelion [°]</TableCell>
            <TableCell align="center">Longitude of Ascending Node [°]</TableCell>
            <TableCell align="center">Inclination [°]</TableCell>
            <TableCell align="center">Mean Anomaly Epoch [JD]</TableCell>
            <TableCell align="center">Mean Anomaly at Epoch [°]</TableCell>
            <TableCell align="center">Orbital Period [yr]</TableCell>
            <TableCell align="center">Absolute Magnitude (H)</TableCell>
            <TableCell align="right">Slope Parameter (G)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(orbitingBodyRecord => (
            <TableRow key={orbitingBodyRecord.bodyDetails.name}>
              <TableCell>
                {orbitingBodyRecord.bodyDetails.name}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.eccentricity}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.semiMajorAxis}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.periapsis}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.apoapsis}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.argumentOfPerihelion}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.longitudeOfAscendingNode}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.inclination}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.meanAnomalyEpoch}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.orbitElements.meanAnomalyAtEpoch}
              </TableCell>
              <TableCell align="right" title={orbitingBodyRecord.orbitalPeriodInDays + " Solar Days"}>
                {orbitingBodyRecord.orbitalPeriod}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.magnitudeParameters.H}
              </TableCell>
              <TableCell align="right">
                {orbitingBodyRecord.magnitudeParameters.G}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
