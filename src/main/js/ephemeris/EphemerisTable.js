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

	const angleUnits = {
		ra: ['h', 'm', 's'],
		d: ['°', '\'', '"']
	}

	function formatAngle(angle, units) {
		const angleAbs = Math.abs(angle);
		const angleFractionInMinutes = (angleAbs - Math.floor(angleAbs)) * 60.0;
		const angleMinutes = Math.trunc(angleFractionInMinutes);
		const angleSeconds = (angleFractionInMinutes - angleMinutes) * 60.0;
		return "" + Math.trunc(angle) + units[0] + " " + ((angleMinutes < 10) ? "0" : "") + angleMinutes + units[1] + " " + ((angleSeconds < 10) ? "0" : "") + angleSeconds.toFixed(2) + units[2];
	}

	function formatHourAngle(angle) {
		return formatAngle(angle / 15.0, angleUnits.ra);
	}

	function formatDegrees(angle) {
		return formatAngle(angle, angleUnits.d);
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
							<TableCell component="th" scope="row" title={row.jde}>
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
