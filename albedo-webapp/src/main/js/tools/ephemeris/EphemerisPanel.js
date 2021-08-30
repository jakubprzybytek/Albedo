import React from 'react';
import { useStateWithLocalStorageInt } from '../../utils/LocalStorage';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../../common/TabPanel';
import EphemerisForm from './EphemerisForm';
import EphemerisTable from './EphemerisTable';
import EphemerisCharts from './EphemerisCharts';
import EphemerisStarMap from './EphemerisStarMap';
import EphemerisOrbitSimulator from './EphemerisOrbitSimulator';
import BodyCard from '../../components/BodyCard';
import EphemerisSourceInfoCard from './EphemerisSourceInfoCard';

const useStyles = makeStyles(theme => ({
  rowSection: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
  columnSectionItem: {
    paddingBottom: theme.spacing(1)
  },
  tabPanel: {
    marginTop: theme.spacing(1),
  },
}));

export default function EphemerisPanel() {

  const [ephemerisList, setEphemerisList] = React.useState([]);
  const [bodyInfo, setBodyInfo] = React.useState();
  const [selectedTab, setSelectedTab] = useStateWithLocalStorageInt('ephemeris.currentTab', 0);
  const [engineInfo, setEngineInfo] = React.useState();

  function onSubmitResponse(data) {
    setEphemerisList(data.ephemerisList);
    setBodyInfo(data.bodyInfo);
    setEngineInfo(data.engine);
  }

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <div className={classes.rowSection}>
          <EphemerisForm setEphemerisData={(data) => onSubmitResponse(data)} />
        </div>
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} variant="scrollable" scrollButtons="auto">
            <Tab label="Table" />
            <Tab label="Charts" />
            <Tab label="Star Map" />
            <Tab label="Orbit Simulator" />
          </Tabs>
        </AppBar>
        <TabPanel value={selectedTab} index={0}>
          <EphemerisTable ephemerisList={ephemerisList} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <EphemerisCharts ephemerisList={ephemerisList} />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <EphemerisStarMap ephemerisList={ephemerisList} />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <EphemerisOrbitSimulator bodyInfo={bodyInfo} ephemerisList={ephemerisList} />
        </TabPanel>
      </Grid>
      <Grid item xs={3}>
        <div className={classes.columnSectionItem}>
          <BodyCard bodyInfo={bodyInfo} />
        </div>
        <EphemerisSourceInfoCard engineInfo={engineInfo} />
      </Grid>
    </Grid>
  );
}
