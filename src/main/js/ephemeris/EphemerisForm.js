import React from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import { addMonths } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1,
      padding: theme.spacing(1, 1),
    },
  field: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
  }
}));

export default function Forms(props) {

  const [bodyName, setBodyName] = React.useState("Ceres");
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addMonths(new Date(), 1));

  function handleSubmit() {
    props.submitForm(bodyName + " " + fromDate + " " + toDate);
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Provide ephemeris parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <TextField
            id="standard-name"
            label="Name"
            value={bodyName}
            className={classes.field}
            onChange={ event => setBodyName(event.target.value)}
            margin="normal" />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyy-MM-dd"
              className={classes.field}
              margin="normal"
              label="From"
              value={fromDate}
              onChange={ date => setFromDate(date) }
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyy-MM-dd"
              className={classes.field}
              margin="normal"
              label="To"
              value={toDate}
              onChange={ date => setToDate(date) }
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
            </MuiPickersUtilsProvider>
          </div>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
            Send
            <Icon className={classes.rightIcon}>send</Icon>
          </Button>
      </form>
    </Paper>
  );
}
