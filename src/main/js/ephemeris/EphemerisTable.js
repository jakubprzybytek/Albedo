import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import { formatHourAngle, formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2),
		width: '800px',
	},
	table: {
		width: '100%'
	},
}));

export default function EphemerisTable(props) {

	const classes = useStyles();

	return (
		<Paper className={classes.paper}>
			<Table className={classes.table} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Time [TD]</TableCell>
						<TableCell align="center">R.A.</TableCell>
						<TableCell align="center">Dec.</TableCell>
						<TableCell align="center">Magnitude</TableCell>
						<TableCell align="right">Distance from Earth [AU]</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.rows.map(row => (
						<TableRow key={row.index}>
							<TableCell component="th" scope="row" title={row.jde}>
								{format(Date.parse(row.jde), "yyyy-MM-dd HH:mm:ss")}
							</TableCell>
							<TableCell align="center" title={row.coordinates.rightAscension}>
								{formatHourAngle(row.coordinates.rightAscension)}
							</TableCell>
							<TableCell align="center" title={row.coordinates.declination}>
								{formatDegrees(row.coordinates.declination)}
							</TableCell>
							<TableCell align="center">
								{row.apparentMagnitude.toFixed(2)}
							</TableCell>
							<TableCell align="right">
								{row.distanceFromEarth.toFixed(6)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	);
}
