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

export default function CometsCatalogueForm(props) {

  const [nameFilter, setNameFilter] = React.useState("ATLAS");

  function onBuildProps() {
    return {
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
        Filter comets:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <TextField label="Name filter" className={classes.field} margin="normal" value={nameFilter} onChange={event => setNameFilter(event.target.value)} />
        <SubmitBar url='/api/catalogue/comets' buildProps={onBuildProps} submitResponse={onSubmitResponse} />
      </form>
    </Paper>
  );
}
