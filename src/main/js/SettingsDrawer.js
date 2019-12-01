import React from 'react';
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
import { red, orange, yellow, blue } from '@material-ui/core/colors';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from './settings/SettingsExpansionPanel';

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

export default function SettingsDrawer(props) {

  const { opened, setOpened } = props;

  const [rtsEnabled, setRtsEnabled] = React.useState(true);
  const [rtsSunEnabled, setRtsSunEnabled] = React.useState(true);
  const [rtsMoonEnabled, setRtsMoonEnabled] = React.useState(true);

  const [conjuntionsWithPlanetsSeparation, setCnjuntionsWithPlanetsSeparation] = React.useState(1);

  const classes = useStyles();

  return (
    <Drawer className={classes.drawer} variant="persistent" anchor="left" open={opened} classes={{ paper: classes.drawerPaper, }} >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setOpened(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <SettingsExpansionPanel color={blue[50]}>
        <SettingsExpansionSummary checked={rtsEnabled} setChecked={setRtsEnabled}>
          <Typography>Rise, Transit &amp; Set</Typography>
        </SettingsExpansionSummary>
        <SettingsExpansionPanelDetails disabled={!rtsEnabled}>
          <Typography variant="subtitle2" component="span">
            Show times of rise, transit and set for:
            <FormGroup className={classes.singlePaddingLeft}>
              <InternalCheckbox label="Sun (incl. civil, nautical, astr.)" disabled={!rtsEnabled} checked={rtsSunEnabled} setChecked={setRtsSunEnabled} />
              <InternalCheckbox label="Moon" disabled={!rtsEnabled} checked={rtsMoonEnabled} setChecked={setRtsMoonEnabled} />
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