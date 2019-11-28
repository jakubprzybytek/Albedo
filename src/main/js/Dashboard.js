import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import EventsList from './eventslist/EventsList';
import ToolTabs from './ToolTabs';
import UserDrawer from './UserDrawer';
import SettingsDrawer from './SettingsDrawer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography component="div" role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} {...other}>
      {children}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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

  const [tabValue, setTabValue] = React.useState(0);
  const [settingsDrawerOpened, setSettingsDrawerOpened] = React.useState(true);
  const [userDrawerOpened, setUserDrawerOpened] = React.useState(false);

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUserDrawerOpened(open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: settingsDrawerOpened, })} color="default" >
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={() => setSettingsDrawerOpened(true)} edge="start" className={clsx(classes.menuButton, settingsDrawerOpened && classes.hide)} >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
        <Tabs className={classes.tabs} value={tabValue} onChange={(event, newTabValue) => setTabValue(newTabValue)} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
            <Tab label="Dashboard" />
            <Tab label="Tools" />
          </Tabs>
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={toggleDrawer(true)} edge="end">
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
          <ToolTabs />
        </TabPanel>
      </main>
      <UserDrawer opened={userDrawerOpened} setOpened={setUserDrawerOpened} />
    </div>
  );
}