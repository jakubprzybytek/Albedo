import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ElongationChip } from '../../components/Chips';
import { formatHourAngle, formatDegrees, formatArcSeconds } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  paper: {
//    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export function BrightCometTableRow(props) {

  const { comet, onClick } = props;

  const [selected, setSelected] = React.useState(false);

  function handleClick() {
    setSelected(!selected);
    onClick(!selected ? comet : null, setSelected);
  }

  return (
    <TableRow key={comet.id} hover role="checkbox" selected={selected} onClick={handleClick}>
      <TableCell component="th" scope="row">
        {comet.bodyDetails.name}
      </TableCell>
      <TableCell align="center" title={comet.ephemerisList[0].coordinates.rightAscension + '°'}>
        {formatHourAngle(comet.ephemerisList[0].coordinates.rightAscension)}
      </TableCell>
      <TableCell align="center" title={comet.ephemerisList[0].coordinates.declination + '°'}>
        {formatDegrees(comet.ephemerisList[0].coordinates.declination)}
      </TableCell>
      <TableCell align="center">
        {comet.ephemerisList[0].distanceFromSun.toFixed(6)}
      </TableCell>
      <TableCell align="center">
        {comet.ephemerisList[0].distanceFromEarth.toFixed(6)}
      </TableCell>
      <TableCell align="center">
        <ElongationChip elongation={comet.ephemerisList[0].elongation} />
      </TableCell>
      <TableCell align="center">
        {comet.ephemerisList[0].apparentMagnitude}
      </TableCell>
      <TableCell align="right">
        {formatArcSeconds(comet.ephemerisList[0].angularSize)}
      </TableCell>
    </TableRow>
  );
}

let setSelectedForPreviousSelection = () => null;

export default function BrightCometsTable(props) {

  const { brightComets, onCometSelected } = props;

  const classes = useStyles();

  function updateRowSelection(comet, setSelected) {
    setSelectedForPreviousSelection(false);
    onCometSelected(comet);
    setSelectedForPreviousSelection = setSelected;
  }

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">R.A. [hms]</TableCell>
            <TableCell align="center">Dec. [°]</TableCell>
            <TableCell align="center">Distance f/Sun [AU]</TableCell>
            <TableCell align="center">Distance f/Earth [AU]</TableCell>
            <TableCell align="center">Elongation [°]</TableCell>
            <TableCell align="center">Magnitude</TableCell>
            <TableCell align="right">Size ["]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brightComets.map(comet => (
            <BrightCometTableRow comet={comet} onClick={updateRowSelection} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
