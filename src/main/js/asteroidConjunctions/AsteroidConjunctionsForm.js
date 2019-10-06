import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { addMonths } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format';
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
  },
}));

export default function AsteroidConjunctionsForm(props) {

  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addMonths(new Date(), 1));

  function onBuildProps() {
    return {
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd")
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Provide asteroid conjunctions computation parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
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
        </div>
        <SubmitBar url='http://localhost:8080/api/asteroidConjunctions' buildProps={onBuildProps} submitResponse={props.updateRows} />
      </form>
    </Paper>
  );
}
