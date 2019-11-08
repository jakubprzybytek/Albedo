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

export default function RiseTransitSetTable(props) {

  const { riseTransitSetEvents } = props;
  
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time [UTC]</TableCell>
            <TableCell align="center">Body</TableCell>
            <TableCell align="right">Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {riseTransitSetEvents.map(event => (
            <TableRow key={event.index}>
              <TableCell component="th" scope="row" title={event.time}>
                {format(Date.parse(event.time), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {event.bodyDetails.name}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                {event.eventType}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
