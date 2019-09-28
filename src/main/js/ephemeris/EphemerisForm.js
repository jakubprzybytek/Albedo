import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import { addMonths, format } from 'date-fns';

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

  function handleSubmit() {
    axios.get('http://localhost:8080/api/ephemeris', {
        params: {
          body: bodyName,
          from: format(fromDate, "yyyy-MM-dd"),
          to: format(toDate, "yyyy-MM-dd"),
          interval: interval
        }
      })
      .then(res => {
        const ephemerisList = res.data.ephemerisList;
        props.updateRows(ephemerisList);
      });
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
              format="yyy-MM-dd"
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
              format="yyy-MM-dd"
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
        <Grid container direction="row" justify="flex-end">
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
            Send
            <Icon className={classes.rightIcon}>send</Icon>
          </Button>
        </Grid>
      </form>
    </Paper>
  );
}
