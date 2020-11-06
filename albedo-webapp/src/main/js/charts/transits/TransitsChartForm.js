import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import SubmitBar from '../../components/SubmitBar2';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    padding: theme.spacing(1, 1),
  },
  field: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function TransitsChartForm(props) {

  const { jsonConnection } = props;
  jsonConnection.registerRequestUriBuilder(buildRequestUrl);
  
  const [bodyNames, setBodyNames] = React.useState("Mars,Jupiter,Saturn,Neptune,Uranus");
  const [fromDate, setFromDate] = React.useState(new Date(new Date().getFullYear(), 0, 1));
  const [toDate, setToDate] = React.useState(new Date(new Date().getFullYear(), 11, 31));

  function buildRequestUrl() {
    return {
      url: '/api/series/transit',
      params: {
        bodies: bodyNames,
        from: format(fromDate, "yyyy-MM-dd"),
        to: format(toDate, "yyyy-MM-dd"),
      }
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Bodies transits parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <TextField className={classes.field} label="Bodies" multiline margin="normal"
            value={bodyNames}
            onChange={event => setBodyNames(event.target.value)} />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker className={classes.field} label="From" disableToolbar variant="inline" margin="normal"
              format="yyyy-MM-dd"
              value={fromDate}
              onChange={date => setFromDate(date)} />
            <KeyboardDatePicker className={classes.field} label="To" disableToolbar variant="inline" margin="normal"
              format="yyyy-MM-dd"
              value={toDate}
              onChange={date => setToDate(date)} />
          </MuiPickersUtilsProvider>
        </div>
        <SubmitBar jsonConnection={jsonConnection} />
      </form>
    </Paper>
  );
}
