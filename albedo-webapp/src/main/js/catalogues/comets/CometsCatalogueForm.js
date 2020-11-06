import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
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

  const { jsonConnection } = props;
  jsonConnection.registerRequestUriBuilder(buildRequestUrl);

  const [nameFilter, setNameFilter] = React.useState("ATLAS");

  function buildRequestUrl() {
    return {
      url: '/api/catalogue/comets',
      params: {
        nameFilter: nameFilter,
      }
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Filter comets:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <TextField label="Name filter" className={classes.field} margin="normal" value={nameFilter} onChange={event => setNameFilter(event.target.value)} />
        <SubmitBar jsonConnection={jsonConnection} />
      </form>
    </Paper>
  );
}
