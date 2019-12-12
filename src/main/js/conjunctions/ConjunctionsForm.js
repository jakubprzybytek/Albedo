import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { addWeeks } from 'date-fns';
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

  const [sunChecked, setSunChecked] = React.useState(true);
  const [moonChecked, setMoonChecked] = React.useState(true);
  const [primaryPlanetsChecked, setPrimaryPlanetsChecked] = React.useState(true);
  const [primaryCometsChecked, setPrimaryCometsChecked] = React.useState(false);
  const [primaryAsteroidsChecked, setPrimaryAsteroidsChecked] = React.useState(false);
  const [secondaryPlanetsChecked, setSecondaryPlanetsChecked] = React.useState(false);
  const [secondaryCometsChecked, setSecondaryCometsChecked] = React.useState(true);
  const [secondaryAsteroidsChecked, setSecondaryAsteroidsChecked] = React.useState(true);
  const [ngcChecked, setNgcChecked] = React.useState(true);
  const [icChecked, setIcChecked] = React.useState(false);

  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(addWeeks(new Date(), 1));

  function onBuildProps() {
    const primaryBodyNames = [];
    if (sunChecked) { primaryBodyNames.push ("Sun") }
    if (moonChecked) { primaryBodyNames.push ("Moon") }
    const primaryBodyTypes = [];
    if (primaryPlanetsChecked) { primaryBodyTypes.push ("Planet") }
    if (primaryCometsChecked) { primaryBodyTypes.push ("Comet") }
    if (primaryAsteroidsChecked) { primaryBodyTypes.push ("Asteroid") }

    const secondaryBodyTypes = [];
    if (secondaryPlanetsChecked) { secondaryBodyTypes.push ("Planet") }
    if (secondaryCometsChecked) { secondaryBodyTypes.push ("Comet") }
    if (secondaryAsteroidsChecked) { secondaryBodyTypes.push ("Asteroid") }
    const catalogues = [];
    if (ngcChecked) { catalogues.push ("NGC") }
    if (icChecked) { catalogues.push ("IC") }

    return {
      primaryBodies: primaryBodyNames.join(','),
      primary: primaryBodyTypes.join(','),
      secondary: secondaryBodyTypes.join(','),
      catalogues: catalogues.join(','),
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd")
    }
  }

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h3">
        Provide conjunctions computation parameters:
      </Typography>
      <form className={classes.container} noValidate autoComplete="off">
        <FormGroup row>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal"
              label="From" value={fromDate} onChange={date => setFromDate(date)} />
            <KeyboardDatePicker disableToolbar variant="inline" format="yyyy-MM-dd" className={classes.field} margin="normal"
              label="To"  value={toDate} onChange={date => setToDate(date)} />
          </MuiPickersUtilsProvider>
        </FormGroup>
        <FormLabel component="legend">Primary objects</FormLabel>
        <FormGroup row>
          <FormControlLabel label="Sun" labelPlacement="start" control={
              <Switch checked={sunChecked} onChange={event => setSunChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Moon" labelPlacement="start" control={
              <Switch checked={moonChecked} onChange={event => setMoonChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Planets" labelPlacement="start" control={
              <Switch checked={primaryPlanetsChecked} onChange={event => setPrimaryPlanetsChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Comets" labelPlacement="start" control={
              <Switch checked={primaryCometsChecked} onChange={event => setPrimaryCometsChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Asteroids" labelPlacement="start" control={
              <Switch checked={primaryAsteroidsChecked} onChange={event => setPrimaryAsteroidsChecked(event.target.checked)} color="primary" />
            }/>
        </FormGroup>
        <FormLabel component="legend">Secondary objects</FormLabel>
        <FormGroup row>
          <FormControlLabel label="Planets" labelPlacement="start" control={
              <Switch checked={secondaryPlanetsChecked} onChange={event => setSecondaryPlanetsChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Comets" labelPlacement="start" control={
              <Switch checked={secondaryCometsChecked} onChange={event => setSecondaryCometsChecked(event.target.checked)} color="primary" />
            }/>
          <FormControlLabel label="Asteroids" labelPlacement="start" control={
              <Switch checked={secondaryAsteroidsChecked} onChange={event => setSecondaryAsteroidsChecked(event.target.checked)} color="primary" />
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
