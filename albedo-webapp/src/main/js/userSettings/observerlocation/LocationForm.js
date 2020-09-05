import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import { updateObserverLocation } from './LocationActions';

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

const mapStateToProps = state => {
  return {
    observerLocation: state.observerLocation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitUpdateObserverLocation: (observerLocation) => {
      dispatch(updateObserverLocation(observerLocation))
    }
  };
};

export function LocationForm(props) {

  const { observerLocation, submitUpdateObserverLocation } = props;

  const classes = useStyles();

  function updateLocation(fieldName, value) {
    submitUpdateObserverLocation({ ...observerLocation, [fieldName]: parseFloat(value) });
  }

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Geographic location
      </Typography>
      <FormControl className={classes.margin}>
        <TextField label="Longitude" className={classes.field} margin="normal" InputProps={{ endAdornment: <InputAdornment position="end">°</InputAdornment>, }} type="number"
          value={observerLocation.longitude} onChange={event => updateLocation('longitude', event.target.value)} />
        <TextField label="Latitude" className={classes.field} margin="normal" InputProps={{ endAdornment: <InputAdornment position="end">°</InputAdornment>, }} type="number"
          value={observerLocation.latitude} onChange={event => updateLocation('latitude', event.target.value)} />
        <TextField label="Height" className={classes.field} margin="normal" InputProps={{ endAdornment: <InputAdornment position="end">m</InputAdornment>, }} type="number"
          value={observerLocation.height} onChange={event => updateLocation('height', event.target.value)} />
      </FormControl>
    </Paper>
  );
};

const ObserverLocationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationForm);

export default ObserverLocationForm;