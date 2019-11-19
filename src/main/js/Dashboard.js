import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import EventsList from './eventslist/EventsList';
import ToolTabs from './ToolTabs';
import LocationForm from './components/observerlocation/LocationForm';

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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    flexDirection: 'row',
  },
  tabs: {
    flexGrow: 1,
  },
  toolBar: {
    minHeight: 0,
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
}));

export default function Dashboard() {

  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);
  const [drawerOpened, setDrawerOpened] = React.useState(false);

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpened(open);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs className={classes.tabs} value={tabValue} onChange={ (event, newTabValue) => setTabValue(newTabValue) } indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="Dashboard" />
          <Tab label="Tools" />
        </Tabs>
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={toggleDrawer(true)} edge="end" className={clsx(classes.menuButton, drawerOpened && classes.hide)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <EventsList />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ToolTabs />
      </TabPanel>
      <Drawer className={classes.drawer} anchor="right" variant="persistent" open={drawerOpened} onClose={toggleDrawer(false)} classes={{paper: classes.drawerPaper}}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <LocationForm />
      </Drawer>
    </div>
  );
}