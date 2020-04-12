import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import SubmitBar from '../../components/SubmitBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    padding: theme.spacing(1, 1),
  },
  field: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  }
}));

export default function EphemerisForm(props) {

  const [catalogueName, setCatalogueName] = React.useState("NGC");
  const [nameFilter, setNameFilter] = React.useState("7600");

  function onBuildProps() {
    return {
      catalogueName: catalogueName,
      nameFilter: nameFilter,
    }
  }

  function onSubmitResponse(data) {
    props.updateRows(data);
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Filter catalogue entries:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <FormControl className={classes.field} margin="normal">
            <InputLabel id="catalogue-name-select-label">Catalogue</InputLabel>
            <Select labelId="catalogue-name-select-label" id="catalogue-name-select" value={catalogueName} onChange={event => setCatalogueName(event.target.value)}>
              <MenuItem value={"Messier"}>Messier</MenuItem>
              <MenuItem value={"NGC"}>NGC</MenuItem>
              <MenuItem value={"IC"}>IC</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Name filter" className={classes.field} margin="normal" value={nameFilter} onChange={event => setNameFilter(event.target.value)} />
        </div>
        <SubmitBar url='/api/catalogue' buildProps={onBuildProps} submitResponse={onSubmitResponse} />
      </form>
    </Paper>
  );
}
