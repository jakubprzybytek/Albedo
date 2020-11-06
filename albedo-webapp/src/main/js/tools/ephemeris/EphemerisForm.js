import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { addMonths, format } from 'date-fns';
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

export default function EphemerisForm(props) {

  const { jsonConnection } = props;
  jsonConnection.registerRequestUriBuilder(buildRequestUrl);

  const [bodyName, setBodyName] = React.useState("Venus");
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addMonths(new Date(), 1));
  const [interval, setInterval] = React.useState("1.0");

  function buildRequestUrl() {
    return {
      url: '/api/ephemerides',
      params: {
        body: bodyName,
        from: format(fromDate, "yyyy-MM-dd"),
        to: format(toDate, "yyyy-MM-dd"),
        interval: interval
      }
    }
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
            className={classes.field} margin="normal"
            label="Name"
            value={bodyName} 
            onChange={event => setBodyName(event.target.value)} />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal" label="From" 
              value={fromDate} 
              onChange={date => setFromDate(date)} />
            <KeyboardDatePicker disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal" label="To"
              value={toDate} 
              onChange={date => setToDate(date)} />
          </MuiPickersUtilsProvider>
          <TextField label="Interval" value={interval} className={classes.field} onChange={event => setInterval(event.target.value)} margin="normal" />
        </div>
        <SubmitBar jsonConnection={jsonConnection} />
      </form>
    </Paper>
  );
}
