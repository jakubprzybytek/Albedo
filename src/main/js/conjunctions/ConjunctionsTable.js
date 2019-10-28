import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import { formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export function ConjunctionTableRow(props) {

  const { conjunction, onClick } = props;

  const [selected, setSelected] = React.useState(false);

  function handleClick() {
    onClick(!selected ? conjunction : null, setSelected);
    setSelected(!selected);
  }

  return (
    <TableRow key={conjunction.index} hover role="checkbox" selected={selected} onClick={handleClick}>
      <TableCell component="th" scope="row" title={conjunction.jde + " [JDE]"}>
        {format(Date.parse(conjunction.time), "yyyy-MM-dd HH:mm:ss")}
      </TableCell>
      <TableCell align="center">
        {conjunction.first.name}
      </TableCell>
      <TableCell align="center">
        {conjunction.second.name}
      </TableCell>
      <TableCell align="right" title={conjunction.separation.toFixed(6)}>
        {formatDegrees(conjunction.separation)}
      </TableCell>
    </TableRow>
  );
}

let setSelectedForPreviousSelection = () => null;

export default function ConjunctionsTable(props) {

  const { rows, onConjunctionSelected } = props;

  function updateRowSelection(conjunction, setSelected) {
    setSelectedForPreviousSelection(false);
    onConjunctionSelected(conjunction);
    setSelectedForPreviousSelection = setSelected;
  }

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time (TDE)</TableCell>
            <TableCell align="center">First body</TableCell>
            <TableCell align="center">Second body</TableCell>
            <TableCell align="right">Separation [°]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(conjunction => 
            <ConjunctionTableRow conjunction={conjunction} onClick={updateRowSelection} />
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
