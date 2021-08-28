import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
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

export default function JplRepositoriesForm(props) {

  const { setEphemerisAdminInfo } = props;

  const jsonConnection = useJsonConnection(setEphemerisAdminInfo);
  jsonConnection.registerRequestUriBuilder(buildRequestUrl);

  function buildRequestUrl() {
    return {
      url: '/api/ephemeris/admin',
      params: {}
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Refresh
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <SubmitBar jsonConnection={jsonConnection} />
      </form>
    </Paper>
  );
}
