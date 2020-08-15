import React from 'react';
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
import BodyCard from '../../components/BodyCard';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
  tabPanel: {
    marginTop: theme.spacing(1),
  },
}));

export default function EphemerisPanel() {

  const [rows, setRows] = React.useState([]);
  const [bodyInfo, setBodyInfo] = React.useState();
  const [selectedTab, setSelectedTab] = React.useState(0);

  const classes = useStyles();

  function handleChange(event, newValue) {
    setSelectedTab(newValue);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <div className={classes.area}>
          <EphemerisForm updateRows={setRows} updateBodyInfo={setBodyInfo} />
        </div>
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Table" />
            <Tab label="Charts" />
            <Tab label="Star Map" />
          </Tabs>
        </AppBar>
        <TabPanel value={selectedTab} index={0}>
          <EphemerisTable rows={rows} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <EphemerisCharts ephemerides={rows} />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <EphemerisStarMap ephemerides={rows} />
        </TabPanel>
      </Grid>
      <Grid item xs={3}>
        <BodyCard bodyInfo={bodyInfo} />
      </Grid>
    </Grid>
  );
}
