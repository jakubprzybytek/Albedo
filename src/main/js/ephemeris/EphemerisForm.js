import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { addMonths, format } from 'date-fns';
import SubmitBar from './../components/SubmitBar';

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

export default function Forms(props) {

  const [bodyName, setBodyName] = React.useState("Ceres");
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addMonths(new Date(), 1));
  const [interval, setInterval] = React.useState("1.0");

  function onBuildProps() {
    return {
      body: bodyName,
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd"),
      interval: interval
    }
  }

  function onSubmitResponse(data) {
    props.updateBodyRecord(data.bodyRecord);
    props.updateRows(data.ephemerisList);
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
            label="Name"
            value={bodyName}
            className={classes.field}
            onChange={event => setBodyName(event.target.value)}
            margin="normal" />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-dd"
              className={classes.field}
              margin="normal"
              label="From"
              value={fromDate}
              onChange={date => setFromDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-dd"
              className={classes.field}
              margin="normal"
              label="To"
              value={toDate}
              onChange={date => setToDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
          </MuiPickersUtilsProvider>
          <TextField
            label="Interval"
            value={interval}
            className={classes.field}
            onChange={event => setInterval(event.target.value)}
            margin="normal" />
        </div>
        <SubmitBar url='http://localhost:8080/api/ephemeris' buildProps={onBuildProps} submitResponse={onSubmitResponse} />
      </form>
    </Paper>
  );
}
