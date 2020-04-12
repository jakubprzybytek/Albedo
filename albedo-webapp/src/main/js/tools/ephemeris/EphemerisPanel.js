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

  const defaultBodyCard = {
    bodyDetails: {
      name: "n/a",
      bodyType: "?"
    },
    orbitElements: {
      epoch: 'n/a',
      eccentricity: 'n/a',
      semiMajorAxis: 'n/a',
      meanMotion: 'n/a',
      argumentOfPerihelion: 'n/a',
      longitudeOfAscendingNode: 'n/a',
      inclination: 'n/a',
      meanAnomalyEpoch: 'n/a',
      meanAnomalyAtEpoch: 'n/a'
    },
    magnitudeParameters: {
      H: 'n/a',
      G: 'n/a'
    }, ...{}
  };

  const [rows, setRows] = React.useState([]);
  const [bodyCard, setBodyCard] = React.useState(defaultBodyCard);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const classes = useStyles();

  function updateBodyCard(newBodyCard) {
    setBodyCard({...defaultBodyCard, ...newBodyCard});
  }

  function handleChange(event, newValue) {
    setSelectedTab(newValue);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <div className={classes.area}>
          <EphemerisForm updateRows={setRows} updateBodyCard={updateBodyCard} />
        </div>
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Table" />
            <Tab label="Charts" />
          </Tabs>
        </AppBar>
        <TabPanel value={selectedTab} index={0}>
          <EphemerisTable rows={rows} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <EphemerisCharts ephemerides={rows} />
        </TabPanel>
      </Grid>
      <Grid item xs={3}>
        <BodyCard bodyInfo={bodyCard} />
      </Grid>
    </Grid>
  );
}
