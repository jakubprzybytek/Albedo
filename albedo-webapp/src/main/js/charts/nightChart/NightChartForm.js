import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
  },
  buttons: {
    display: 'inline-flex',
    flexDirection: 'column',
  },
  button: {
    display: 'inline-flex',
    marginBottom: theme.spacing(1),
  }
}));

export default function NightChartForm(props) {

  const { updateAltitudesResponse } = props;
  
  const [bodyNames, setBodyNames] = React.useState("Sun,Moon,Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus");
  const [date, setDate] = React.useState(new Date());

  const classes = useStyles();

  function onBuildProps() {
    return {
      bodies: bodyNames,
      date: format(date, "yyyy-MM-dd"),
    }
  }

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Bodies altitude parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <TextField className={classes.field} label="Bodies" multiline margin="normal"
            value={bodyNames}
            onChange={event => setBodyNames(event.target.value)} />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker className={classes.field} label="Date" disableToolbar variant="inline" margin="normal"
              format="yyyy-MM-dd"
              value={date}
              onChange={date => setDate(date)} />
          </MuiPickersUtilsProvider>
          <div className={classes.buttons}>
            <Button className={classes.button} size="small" variant="outlined" color="secondary"
              onClick={() => setDate(new Date())}>
              Now
            </Button>
            <Button className={classes.button} size="small" variant="outlined" color="secondary"
              onClick={() => setDate(addDays(date, -1))}>
              Prev day
            </Button>
            <Button className={classes.button} size="small" variant="outlined" color="secondary"
              onClick={() => setDate(addDays(date, 1))}>
              Next day
            </Button>
          </div>
        </div>
        <SubmitBar url='/api/altitude' buildProps={onBuildProps} submitResponse={data => updateAltitudesResponse(data)} />
      </form>
    </Paper>
  );
}
