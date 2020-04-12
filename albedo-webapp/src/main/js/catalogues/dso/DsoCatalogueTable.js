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

export default function DsoCatalogueTable(props) {

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">R.A. [hms]</TableCell>
            <TableCell align="center">Dec. [°]</TableCell>
            <TableCell align="center">Magnitude (V)</TableCell>
            <TableCell align="center">Magnitude (B)</TableCell>
            <TableCell align="right">Size ["]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(catalogueEntry => (
            <TableRow key={catalogueEntry.name}>
              <TableCell>
                {catalogueEntry.name}
              </TableCell>
              <TableCell align="center">
                {catalogueEntry.type}
              </TableCell>
              <TableCell align="center" title={catalogueEntry.coordinates.rightAscension + '°'}>
                {formatHourAngle(catalogueEntry.coordinates.rightAscension)}
              </TableCell>
              <TableCell align="center" title={catalogueEntry.coordinates.declination + '°'}>
                {formatDegrees(catalogueEntry.coordinates.declination)}
              </TableCell>
              <TableCell align="center">
                {catalogueEntry.vMagnitude}
              </TableCell>
              <TableCell align="center">
                {catalogueEntry.bMagnitude}
              </TableCell>
              <TableCell align="right">
                {catalogueEntry.majorAxisSize}{catalogueEntry.minorAxisSize && " x " + catalogueEntry.minorAxisSize}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
