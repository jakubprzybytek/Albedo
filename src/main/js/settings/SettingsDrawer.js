import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { red, blue } from '@material-ui/core/colors';
import { updateRtsSettings } from './RtsSettingsActions';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from './SettingsExpansionPanel';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    minHeight: 48,
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',
  },
  singlePaddingLeft: {
    paddingLeft: theme.spacing(1),
  },
  formControl: {
    paddingLeft: 3,
  },
  fieldsAligned: {
    paddingTop: 3,
  },
}));

const mapStateToProps = state => {
  return {
    rtsSettings: state.rtsSettings
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitUpdateRtsSettings: (rtsSettings) => {
      dispatch(updateRtsSettings(rtsSettings))
    }
  };
};

export function SettingsDrawer(props) {

  const { opened, setOpened, rtsSettings, submitUpdateRtsSettings } = props;

  const [localRtsSettings, setLocalRtsSettings] = React.useState(rtsSettings);

  const [conjuntionsWithPlanetsSeparation, setCnjuntionsWithPlanetsSeparation] = React.useState(1);

  const classes = useStyles();

  function updateRtsSettings(fieldName, value) {
    let newRtsSettings = { ...localRtsSettings, [fieldName]: value };
    setLocalRtsSettings(newRtsSettings);
    submitUpdateRtsSettings(newRtsSettings);
  }

  return (
    <Drawer className={classes.drawer} variant="persistent" anchor="left" open={opened} classes={{ paper: classes.drawerPaper, }} >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setOpened(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <SettingsExpansionPanel color={blue[50]}>
        <SettingsExpansionSummary checked={localRtsSettings.rtsEnabled} setChecked={value => updateRtsSettings('rtsEnabled', value)}>
          <Typography>Rise, Transit &amp; Set</Typography>
        </SettingsExpansionSummary>
        <SettingsExpansionPanelDetails disabled={!localRtsSettings.rtsEnabled}>
          <Typography variant="subtitle2" component="span">
            Show times of rise, transit and set for:
            <FormGroup className={classes.singlePaddingLeft}>
              <InternalCheckbox label="Sun (incl. civil, nautical, astr.)"
                disabled={!localRtsSettings.rtsEnabled} checked={localRtsSettings.rtsSunEnabled} setChecked={value => updateRtsSettings('rtsSunEnabled', value)} />
              <InternalCheckbox label="Moon"
                disabled={!localRtsSettings.rtsEnabled} checked={localRtsSettings.rtsMoonEnabled} setChecked={value => updateRtsSettings('rtsMoonEnabled', value)} />
            </FormGroup>
          </Typography>
        </SettingsExpansionPanelDetails>
      </SettingsExpansionPanel>
      <SettingsExpansionPanel color={red[50]}>
        <SettingsExpansionSummary>
          <Typography>Conjunctions</Typography>
        </SettingsExpansionSummary>
        <SettingsExpansionPanelDetails>
          <Typography className={classes.fieldsAligned} color="textSecondary">
            The
          </Typography>
          <FormControl className={classes.formControl}>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={conjuntionsWithPlanetsSeparation} onChange={(event) => setCnjuntionsWithPlanetsSeparation(event.target.value)} >
              <MenuItem value={1}>1°</MenuItem>
              <MenuItem value={2}>2°</MenuItem>
              <MenuItem value={5}>5°</MenuItem>
            </Select>
          </FormControl>
        </SettingsExpansionPanelDetails>
      </SettingsExpansionPanel>
    </Drawer>
  );
}

const GlobalStateAwareSettingsDrawer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsDrawer);

export default GlobalStateAwareSettingsDrawer;