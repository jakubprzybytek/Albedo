import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 650,
	},
}));

export default function EphemerisTable(props) {

	const classes = useStyles();

	function formatHourAngle(angleDegrees) {
		const angle = angleDegrees / 15.0;
		const angleAbs = Math.abs(angle);
		const angleFractionInMinutes = (angleAbs - Math.floor(angleAbs)) * 60.0;
		return "" + Math.trunc(angle) + "h " + Math.trunc(angleFractionInMinutes) + "m " + ((angleFractionInMinutes - Math.trunc(angleFractionInMinutes)) * 60.0).toFixed(2) + "s";
	}

	function formatDegrees(angle) {
		const angleAbs = Math.abs(angle);
		const angleFractionInMinutes = (angleAbs - Math.floor(angleAbs)) * 60.0;
		return "" + Math.trunc(angle) + "° " + Math.trunc(angleFractionInMinutes) + "' " + ((angleFractionInMinutes - Math.trunc(angleFractionInMinutes)) * 60.0).toFixed(2) + "\"";
	}

	return (
		<Paper className={classes.paper}>
			<Table className={classes.table} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Time (TD)</TableCell>
						<TableCell align="right">R.A.</TableCell>
						<TableCell align="right">Dec.</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.rows.map(row => (
						<TableRow key={row.index}>
							<TableCell component="th" scope="row">
								{format(Date.parse(row.jde), "yyyy-MM-dd hh:mm:ss")}
							</TableCell>
							<TableCell align="right">
								{formatHourAngle(row.coordinates.rightAscension)}
							</TableCell>
							<TableCell align="right">
								{formatDegrees(row.coordinates.declination)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	);
}
