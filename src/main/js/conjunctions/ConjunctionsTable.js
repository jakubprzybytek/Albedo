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

export default function ConjunctionsTable(props) {

	const classes = useStyles();

	return (
		<Paper className={classes.paper}>
			<Table className={classes.table} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Time [TDE]</TableCell>
						<TableCell align="center">First body</TableCell>
						<TableCell align="center">Second body</TableCell>
						<TableCell align="right">Separation [°]</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.rows.map(row => (
						<TableRow key={row.index}>
							<TableCell component="th" scope="row" title={row.dateTimeTD}>
								{format(Date.parse(row.dateTimeTD), "yyyy-MM-dd HH:mm:ss")}
							</TableCell>
							<TableCell align="center">
								{row.firstBody.name}
							</TableCell>
							<TableCell align="center">
								{row.secondBody.name}
							</TableCell>
							<TableCell align="right" title={row.separation.toFixed(6)}>
								{formatDegrees(row.separation)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	);
}
