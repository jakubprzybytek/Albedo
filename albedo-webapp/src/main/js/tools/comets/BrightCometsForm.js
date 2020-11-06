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

export default function BrightCometsForm(props) {

  const { jsonConnection } = props;
  jsonConnection.registerRequestUriBuilder(buildRequestUrl);
  
  const [date, setDate] = React.useState(new Date());
  const [magnitudeLimit, setMagnitudeLimit] = React.useState(10.0);

  function buildRequestUrl() {
    return {
      url: '/api/comets/bright',
      params: {
        date: format(date, "yyyy-MM-dd"),
        magnitudeLimit: magnitudeLimit
      }
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Bright Comets:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal"
              label="Date"
              value={date}
              onChange={date => setDate(date)}  />
          </MuiPickersUtilsProvider>
          <TextField label="Magnitude limit" value={magnitudeLimit} className={classes.field} onChange={event => setMagnitudeLimit(event.target.value)} margin="normal" />
        </div>
        <SubmitBar jsonConnection={jsonConnection} />
      </form>
    </Paper>
  );
}
