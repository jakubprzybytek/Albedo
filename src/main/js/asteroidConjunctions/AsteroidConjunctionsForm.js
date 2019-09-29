import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { addMonths } from 'date-fns';
import axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format';

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
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function AsteroidConjunctionsForm(props) {

  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addMonths(new Date(), 1));

  const [loading, setLoading] = React.useState(false);

  function handleSubmit() {

    setLoading(true);

    axios.get('http://localhost:8080/api/asteroidConjunctions', {
        params: {
          from: format(fromDate, "yyyy-MM-dd"),
          to: format(toDate, "yyyy-MM-dd")
        }
      })
      .then(res => {
        const conjList = res.data;
        props.updateRows(conjList);

        setLoading(false);
      });
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
        <Grid container direction="row" justify="flex-end">
          <div className={classes.wrapper}>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit} disabled={loading}>
              Send
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Grid>
      </form>
    </Paper>
  );
}
