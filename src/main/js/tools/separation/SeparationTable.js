import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { LocalDateTimeChip } from '../../components/Chips';
import { formatDegrees } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  table: {
    width: '100%',
  },
}));

export default function SeparationTable(props) {

  const { rows } = props;

  const classes = useStyles();

  return (
    <Paper>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Local Time</TableCell>
            <TableCell align="right">Separation [°]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(separation => (
            <TableRow key={separation.id}>
              <TableCell component="th" scope="row">
                <LocalDateTimeChip time={separation.localTime} jd={separation.jde} />
              </TableCell>
              <TableCell align="right">
                {formatDegrees(separation.separation)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
