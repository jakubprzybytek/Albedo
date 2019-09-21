import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

export default function EphemerisTable(props) {

  const classes = useStyles();

  return (
		<Paper className={classes.paper}>
		  <Table className={classes.table} size="small">
			<TableHead>
			  <TableRow>
				<TableCell>Dessert (100g serving)</TableCell>
				<TableCell align="right">Calories</TableCell>
				<TableCell align="right">Fat&nbsp;(g)</TableCell>
				<TableCell align="right">Carbs&nbsp;(g)</TableCell>
				<TableCell align="right">Protein&nbsp;(g)</TableCell>
			  </TableRow>
			</TableHead>
			<TableBody>
			  {props.rows.map(row => (
				<TableRow key={row.name}>
				  <TableCell component="th" scope="row">
					{row.name}
				  </TableCell>
				  <TableCell align="right">{row.calories}</TableCell>
				  <TableCell align="right">{row.fat}</TableCell>
				  <TableCell align="right">{row.carbs}</TableCell>
				  <TableCell align="right">{row.protein}</TableCell>
				</TableRow>
			  ))}
			</TableBody>
		  </Table>
		</Paper>
  );
}
