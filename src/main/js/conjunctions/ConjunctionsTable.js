import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { format } from 'date-fns';
import { formatDegrees, formatArcSeconds } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  objectCell: {
    display: 'flex',
    flexDirection: 'column',
  },
  objectCellRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

const StyledChip = withStyles({
  root: {
    height: '18px'
  },
  avatar: {
    fontSize: '0.7rem',
    width: '18px',
    height: '18px'
  },
  label: {
    fontSize: '0.7rem',
    paddingLeft: '6px',
    paddingRight: '5px'
  },
})(Chip);

function BodyInfoCell(props) {

  const { bodyInfo } = props;

  const classes = useStyles();

  return (
    <div className={classes.objectCell}>
      <div className={classes.objectCellRow}>
        {props.bodyInfo.bodyDetails.name}
      </div>
      <div className={classes.objectCellRow}>
        <StyledChip variant="outlined" avatar={<Avatar>M</Avatar>} label={bodyInfo.ephemeris.apparentMagnitude} color="primary" />
        {bodyInfo.ephemeris.angularSize && <StyledChip variant="outlined" avatar={<Avatar>S</Avatar>} label={formatArcSeconds(bodyInfo.ephemeris.angularSize)} color="secondary" />}
      </div>
    </div>
  );
}

function CatalogueEntryCell(props) {

  const { catalogueEntry } = props;

  const classes = useStyles();

  return (
    <div className={classes.objectCell}>
      <div className={classes.objectCellRow}>
        {catalogueEntry.name}
      </div>
      <div className={classes.objectCellRow}>
        {catalogueEntry.vMagnitude && <StyledChip variant="outlined" avatar={<Avatar>Mv</Avatar>} label={catalogueEntry.vMagnitude} color="primary" />}
        {!catalogueEntry.vMagnitude && catalogueEntry.bMagnitude  && <StyledChip variant="outlined" avatar={<Avatar>Mb</Avatar>} label={catalogueEntry.bMagnitude} color="primary" />}
        {catalogueEntry.majorAxisSize && <StyledChip variant="outlined" avatar={<Avatar>S</Avatar>} label={catalogueEntry.majorAxisSize + "\""} color="secondary" />}
      </div>
    </div>
  );
}

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
        {conjunction.firstObjectType == 'Body' && <BodyInfoCell bodyInfo={conjunction.first} />}
      </TableCell>
      <TableCell align="center">
        {conjunction.secondObjectType == 'Body' && <BodyInfoCell bodyInfo={conjunction.second} />}
        {conjunction.secondObjectType == 'CatalogueEntry' && <CatalogueEntryCell catalogueEntry={conjunction.second} />}
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
