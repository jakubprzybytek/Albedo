import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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

export default function ConjunctionsForm(props) {

  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addMonths(new Date(), 1));
  const [sunChecked, setSunChecked] = React.useState(true);
  const [moonChecked, setMoonChecked] = React.useState(true);
  const [planetsChecked, setPlanetsChecked] = React.useState(true);
  const [asteroidsChecked, setAsteroidsChecked] = React.useState(false);
  const [ngcChecked, setNgcChecked] = React.useState(true);
  const [icChecked, setIcChecked] = React.useState(false);

  function onBuildProps() {
    const secondary = [];
    if (sunChecked) { secondary.push ("Sun") }
    if (moonChecked) { secondary.push ("Moon") }
    if (planetsChecked) { secondary.push ("Planet") }
    if (asteroidsChecked) { secondary.push ("Asteroid") }
    const catalogues = [];
    if (ngcChecked) { catalogues.push ("NGC") }
    if (icChecked) { catalogues.push ("IC") }
    return {
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd"),
      secondary: secondary.join(','),
      catalogues: catalogues.join(',')
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Provide conjunctions computation parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
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
        <FormLabel component="legend">Compare Planets with: </FormLabel>
        <FormGroup row>
          <FormControlLabel label="Sun" labelPlacement="start" control={
              <Switch checked={sunChecked} onChange={event => setSunChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Moon" labelPlacement="start" control={
              <Switch checked={moonChecked} onChange={event => setMoonChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Planets" labelPlacement="start" control={
              <Switch checked={planetsChecked} onChange={event => setPlanetsChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Asteroids" labelPlacement="start" control={
              <Switch checked={asteroidsChecked} onChange={event => setAsteroidsChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="NGC" labelPlacement="start" control={
              <Switch checked={ngcChecked} onChange={event => setNgcChecked(event.target.checked)} color="secondary" />
            }/>
          <FormControlLabel label="IC" labelPlacement="start" control={
              <Switch checked={icChecked} onChange={event => setIcChecked(event.target.checked)} color="secondary" />
            }/>
        </FormGroup>
        <SubmitBar url='/api/conjunctions' buildProps={onBuildProps} submitResponse={props.updateRows} />
      </form>
    </Paper>
  );
}
