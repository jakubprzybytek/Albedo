import React from 'react';
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { updateTimeZone } from './TimeZoneActions';

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
    timeZone: state.timeZone
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (timeZone) => {
      dispatch(updateTimeZone(timeZone))
    }
  };
};

export function TimeZoneForm(props) {

  const { timeZone, onChange } = props;

  const [localTimeZone, setLocalTimeZone] = React.useState(timeZone);

  const classes = useStyles();

  function updateTimeZone(event) {
    setLocalTimeZone(event.target.value);
    onChange(event.target.value);
  }

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Time
      </Typography>
      <FormControl className={classes.margin}>
        <InputLabel id="time-zone-field-label">Time Zone</InputLabel>
        <Select className={classes.field} value={localTimeZone} onChange={updateTimeZone} labelId="time-zone-field-label">
          <MenuItem value={"UTC"}>UTC</MenuItem>
          <MenuItem value={"UTC+01:00"}>UTC+01:00</MenuItem>
          <MenuItem value={"UTC+02:00"}>UTC+02:00</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
};

const ReduxTimeZoneForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeZoneForm);

export default ReduxTimeZoneForm;