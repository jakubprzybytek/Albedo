import React from 'react';
import { useStateWithLocalStorageInt } from '../utils/LocalStorage';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../common/TabPanel';
import NightChartPanel from './nightChart/NightChartPanel';
import VisibilityChartPanel from './visibility/VisibilityChartPanel';

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
    width: '100%',
  }
}));

export default function ToolTabs() {

  const [value, setValue] = useStateWithLocalStorageInt('chartTabs.currentTab', 0);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs orientation="vertical" variant="scrollable" value={value} onChange={(event, newValue) => setValue(newValue)} aria-label="Vertical tabs" className={classes.tabs}>
        <Tab label="Night Chart" />
        <Tab label="Hourglass Chart" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <NightChartPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <VisibilityChartPanel />
      </TabPanel>
    </div>
  );
}