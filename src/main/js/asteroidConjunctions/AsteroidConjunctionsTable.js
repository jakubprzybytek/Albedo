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
		width: '800px'
	},
	table: {
		width: '100%'
	},
}));

export default function AsteroidConjunctionsTable(props) {

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

	function formatDegrees2(angle) {
		return formatAngle(angle, angleUnits.d);
	}

	return (
		<Paper className={classes.paper}>
			<Table className={classes.table} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Time (TD)</TableCell>
						<TableCell align="center">First body</TableCell>
						<TableCell align="center">Second body</TableCell>
						<TableCell align="right">Separation</TableCell>
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
