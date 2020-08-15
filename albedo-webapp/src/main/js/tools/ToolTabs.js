import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../common/TabPanel';
import EphemerisPanel from './ephemeris/EphemerisPanel';
import ConjunctionsPanel from './conjunctions/ConjunctionsPanel';
import SeparationPanel from './separation/SeparationPanel';
import RiseTransitSetPanel from './riseTransitSet/RiseTransitSetPanel';
import BrightCometsPanel from './comets/BrightCometsPanel';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabPanel: {
    padding: theme.spacing(1, 1, 1, 1),
    width: '100%',
    backgroundColor: theme.palette.background.default,
  }
}));

export default function ToolTabs() {

  const [value, setValue] = React.useState(4);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange} aria-label="Vertical tabs example" className={classes.tabs}>
        <Tab label="Ephemeris" />
        <Tab label="Conjunctions" />
        <Tab label="Separation" />
        <Tab label="Rise Transit Set" />
        <Tab label="Bright Comets" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <EphemerisPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <ConjunctionsPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={2}>
        <SeparationPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={3}>
        <RiseTransitSetPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={4}>
        <BrightCometsPanel />
      </TabPanel>
    </div>
  );
}