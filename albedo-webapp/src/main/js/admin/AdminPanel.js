import React from 'react';
import { useStateWithLocalStorageInt } from '../utils/LocalStorage';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../common/TabPanel';
import SystemInfoPanel from './systemAdmin/SystemInfoPanel';
import JplRepositoriesPanel from './jplRepositories/JplRepositoriesPanel';

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

export default function AdminPanel() {

  const [value, setValue] = useStateWithLocalStorageInt('adminTabs.currentTab', 0);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs orientation="vertical" variant="scrollable" value={value} onChange={(event, newValue) => setValue(newValue)} className={classes.tabs}>
        <Tab label="System Info" />
        <Tab label="JPL Repos" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <SystemInfoPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <JplRepositoriesPanel />
      </TabPanel>
    </div>
  );
}