import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import EphemerisPanel from './ephemeris/EphemerisPanel';
import ConjunctionsPanel from './conjunctions/ConjunctionsPanel';
import RiseTransitSetPanel from './riseTransitSet/RiseTransitSetPanel';

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
    backgroundColor: theme.palette.background.default,
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function ToolTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}>
        <Tab label="Ephemeris" {...a11yProps(0)} />
        <Tab label="Conjunctions" {...a11yProps(1)} />
        <Tab label="Rise Transit Set" {...a11yProps(2)} />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <EphemerisPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <ConjunctionsPanel />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={2}>
        <RiseTransitSetPanel />
    </TabPanel>
    </div>
  );
}