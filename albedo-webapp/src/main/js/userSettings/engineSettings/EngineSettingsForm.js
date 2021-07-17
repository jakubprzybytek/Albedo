import React from 'react';
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { updateEngineSettings } from './EngineSettingsActions';

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
    engineSettings: state.engineSettings
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitUpdateEngineSettings: (engineSettings) => {
      dispatch(updateEngineSettings(engineSettings))
    }
  };
};

export function EngineSettingsForm(props) {

  const { engineSettings, submitUpdateEngineSettings } = props;

  function updateLocation(fieldName, value) {
    submitUpdateEngineSettings({ ...engineSettings, [fieldName]: value });
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Engine
      </Typography>
      <FormControl className={classes.margin}>
        <InputLabel id="time-zone-field-label">Ephemeris method pref.</InputLabel>
        <Select className={classes.field} 
          value={engineSettings.ephemerisMethodPreference} 
          onChange={event => updateLocation('ephemerisMethodPreference', event.target.value)} 
          labelId="time-zone-field-label">
          <MenuItem value={''}>Default</MenuItem>
          <MenuItem value={"de440"}>DE440</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
};

const ReduxEngineSettingsForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(EngineSettingsForm);

export default ReduxEngineSettingsForm;