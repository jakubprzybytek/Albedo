import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import { BodyChip, CatalogueEntryChip, LocalDateTimeChip } from '../components/Chips';
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
            <TableCell>Local Time</TableCell>
            <TableCell align="center">Body</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Azimuth</TableCell>
            <TableCell align="right">Altitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {riseTransitSetEvents.map(event => (
            <TableRow key={event.id}>
              <TableCell component="th" scope="row">
                <LocalDateTimeChip time={event.localTime} jd={event.jde} />
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                <BodyChip bodyDetails={event.bodyDetails} />
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {event.eventType}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {event.azimuth && formatDegrees(event.azimuth)}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                {event.altitude && formatDegrees(event.altitude)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
