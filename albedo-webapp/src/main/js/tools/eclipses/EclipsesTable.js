import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { BodyChip, LocalDateTimeChip } from '../../components/Chips';
import { formatDegrees } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'inline-flex'
  },
}));

export default function EclipsesTable(props) {

  const { eclipseEvents, selectedEvent, setSelectedEvent } = props;
  
  const classes = useStyles();

  const selectEvent = (event) => () => {
      setSelectedEvent(event);
    }

  return (
    <Paper className={classes.paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Local Time</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Separation</TableCell>
            <TableCell align="right">Position angle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eclipseEvents.map(event => (
            <TableRow key={event.id} selected={selectedEvent && event.id === selectedEvent.id} onClick={selectEvent(event)}>
              <TableCell component="th" scope="row">
                <LocalDateTimeChip time={event.localTime} jd={event.jde} />
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {event.eclipsed.bodyDetails.name} eclipse
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {formatDegrees(event.separation)}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                {event.positionAngle.toFixed(1)}°
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
