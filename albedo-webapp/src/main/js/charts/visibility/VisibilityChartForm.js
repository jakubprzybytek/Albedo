import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
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

export default function VisibilityForm(props) {

  const { updateVisibilityChartResponse } = props;
  
  const [bodyNames, setBodyNames] = React.useState("Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus");
  const [fromDate, setFromDate] = React.useState(new Date(new Date().getFullYear(), 0, 1));
  const [toDate, setToDate] = React.useState(new Date(new Date().getFullYear(), 11, 31));
  const [interval, setInterval] = React.useState("1.0");

  function onBuildProps() {
    return {
      bodies: bodyNames,
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd"),
      interval: interval
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Provide chart parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <TextField 
            label="Name"
            value={bodyNames}
            className={classes.field}
            multiline
            margin="normal"
            onChange={event => setBodyNames(event.target.value)} />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal" label="From" value={fromDate} onChange={date => setFromDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
            <KeyboardDatePicker disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal" label="To" value={toDate} onChange={date => setToDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
          </MuiPickersUtilsProvider>
          <TextField label="Interval" value={interval} className={classes.field} onChange={event => setInterval(event.target.value)} margin="normal" />
        </div>
        <SubmitBar url='/api/charts/visibility' buildProps={onBuildProps} submitResponse={(data) => updateVisibilityChartResponse(data)} />
      </form>
    </Paper>
  );
}
