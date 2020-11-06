import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  status: {
    fontSize: '0.7rem',
  },
  error: {
    fontSize: '0.7rem',
    color: red[500],
  },
  wrapper: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function SubmitBar(props) {

  const { jsonConnection } = props;

  const classes = useStyles();

  function handleSubmit() {
    jsonConnection.submit();
  }

  return (
    <Grid container direction="row" justify="space-between">
      <Grid item className={classes.wrapper}>
        {!jsonConnection.loading && <div className={classes.status}>
          {jsonConnection.lastCall && <Typography className={classes.status}>Data received at {jsonConnection.lastCall} in {jsonConnection.duration}ms.</Typography>}
          {jsonConnection.errorMessage && <Typography className={classes.error}>{jsonConnection.errorMessage}</Typography>}
          {jsonConnection.linkUrl && <Link href={jsonConnection.linkUrl}>API link</Link>}
        </div>}
      </Grid>
      <Grid item className={classes.wrapper}>
        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit} disabled={jsonConnection.loading}>
          Send
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>
        {jsonConnection.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Grid>
    </Grid>
  );
}