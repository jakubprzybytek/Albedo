import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { addDays, format } from 'date-fns';
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

export default function NightChartForm(props) {

  const { updateAltitudesResponse } = props;
  
  const [bodyNames, setBodyNames] = React.useState("Sun,Moon,Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus");
  const [date, setDate] = React.useState(new Date());

  function onBuildProps() {
    return {
      bodies: bodyNames,
      date: format(date, "yyyy-MM-dd"),
    }
  }

  function onSubmitResponse(data) {
    updateAltitudesResponse(data);
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Bodies altitude parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <TextField
            label="Bodies"
            value={bodyNames}
            className={classes.field}
            multiline
            onChange={event => setBodyNames(event.target.value)}
            margin="normal" />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-dd"
              className={classes.field}
              margin="normal"
              label="Date"
              value={date}
              onChange={date => setDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
          </MuiPickersUtilsProvider>
        </div>
        <SubmitBar url='/api/altitude' buildProps={onBuildProps} submitResponse={onSubmitResponse} />
      </form>
    </Paper>
  );
}
