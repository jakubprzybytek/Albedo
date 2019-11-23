import React from 'react';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import axios from 'axios';
import format from 'date-fns/format';

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

const mapStateToProps = state => {
  return {
    observerLocation: state.observerLocation,
    timeZone: state.timeZone
  };
};

function SubmitBar(props) {

  const { url, buildProps, submitResponse, observerLocation, timeZone } = props;

  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  
  const [lastCall, setLastCall] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [duration, setDuration] = React.useState(0);

  function handleSubmit() {

    setLoading(true);
    var startTime = new Date();

    axios.get(url, {
        params: {...buildProps(), ...observerLocation, timeZone: timeZone }
      })
      .then(res => {
        setDuration(new Date() - startTime);
        setLastCall(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        setLinkUrl(res.request.responseURL);
        setErrorMessage('');

        submitResponse(res.data);

        setLoading(false);
      },
      error => {
        setLinkUrl(error.request.responseURL);
        setErrorMessage(error.message);
        setLoading(false);
      });
  }

  return (
    <Grid container direction="row" justify="space-between">
      <Grid item className={classes.wrapper}>
        {!loading && <div className={classes.status}>
          {lastCall && <Typography className={classes.status}>Data received at {lastCall} in {duration}ms.</Typography>}
          {errorMessage && <Typography className={classes.error}>{errorMessage}</Typography>}
          {linkUrl && <Link href={linkUrl}>API link</Link>}
        </div>}
      </Grid>
      <Grid item className={classes.wrapper}>
        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit} disabled={loading}>
          Send
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Grid>
    </Grid>
  );
}

const LocationAwareSubmitBar = connect(
  mapStateToProps
)(SubmitBar);

export default LocationAwareSubmitBar;