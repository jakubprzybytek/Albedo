import React from 'react';
import clsx from 'clsx';
import { useStateWithLocalStorageInt } from './utils/LocalStorage';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import TuneIcon from '@material-ui/icons/Tune';
import PersonIcon from '@material-ui/icons/Person';
import TabPanel from './common/TabPanel';
import EventsList from './events/EventsList';
import ChartTabs from './charts/ChartTabs';
import ToolTabs from './tools/ToolTabs';
import CataloguesPanel from './catalogues/CataloguesPanel';
import UserDrawer from './userSettings/UserDrawer';
import SettingsDrawer from './events/SettingsDrawer';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    flexDirection: 'row',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolBar: {
    minHeight: 48,
  },
  tabs: {
    display: 'flex',
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    minHeight: 48,
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();

  const [tabValue, setTabValue] = useStateWithLocalStorageInt('dashboard.currentTab', 0);
  const [settingsDrawerOpened, setSettingsDrawerOpened] = React.useState(false);
  const [userDrawerOpened, setUserDrawerOpened] = React.useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: settingsDrawerOpened, })} color="default" >
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={() => setSettingsDrawerOpened(true)} edge="start" className={clsx(classes.menuButton, settingsDrawerOpened && classes.hide)} >
            <TuneIcon />
          </IconButton>
        </Toolbar>
        <Tabs className={classes.tabs} value={tabValue} onChange={(event, newTabValue) => setTabValue(newTabValue)} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="Events" />
          <Tab label="Charts" />
          <Tab label="Tools" />
          <Tab label="Catalogues" />
        </Tabs>
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={() => setUserDrawerOpened(true)} edge="end">
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SettingsDrawer opened={settingsDrawerOpened} setOpened={setSettingsDrawerOpened} />
      <main className={clsx(classes.content, { [classes.contentShift]: settingsDrawerOpened, })} >
        <div className={classes.drawerHeader} />
        <TabPanel value={tabValue} index={0}>
          <EventsList />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ChartTabs />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ToolTabs />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <CataloguesPanel />
        </TabPanel>
      </main>
      <UserDrawer opened={userDrawerOpened} setOpened={setUserDrawerOpened} />
    </div>
  );
}