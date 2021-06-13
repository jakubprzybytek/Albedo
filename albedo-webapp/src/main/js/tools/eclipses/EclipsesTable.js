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
//    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export default function EclipsesTable(props) {

  const { eclipsesEvents } = props;
  
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Local Time</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Separation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eclipsesEvents.map(event => (
            <TableRow key={event.id}>
              <TableCell component="th" scope="row">
                <LocalDateTimeChip time={event.localTime} jd={event.jde} />
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                Sun eclipse
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {formatDegrees(event.separation)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
