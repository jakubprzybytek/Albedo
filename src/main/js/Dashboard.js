import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import ToolTabs from './ToolTabs';
import LocationForm from './components/observerlocation/LocationForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}>
      <Box p={3}>{children}</Box>
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

  const [value, setValue] = React.useState(0);
  const [drawerOpened, setDrawerOpened] = React.useState(false);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpened(open);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs className={classes.tabs} value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="Tools" />
          <Tab label="Tab 2" />
        </Tabs>
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={toggleDrawer(true)} edge="end" className={clsx(classes.menuButton, drawerOpened && classes.hide)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ToolTabs />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Six
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