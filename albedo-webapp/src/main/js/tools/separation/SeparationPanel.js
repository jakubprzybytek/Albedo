import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../../common/TabPanel';
import SeparationForm from './SeparationForm';
import SeparationTable from './SeparationTable';
import SeparationCharts from './SeparationCharts';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
  tabPanel: {
    marginTop: theme.spacing(1),
  },
}));

export default function SeparationPanel() {

  const [rows, setRows] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const jsonConnection = useJsonConnection(setRows);

  const classes = useStyles();

  function handleChange(event, newValue) {
    setSelectedTab(newValue);
  }

  return (
    <Grid container spacing={2}>
      <Grid item>
        <div className={classes.area}>
          <SeparationForm jsonConnection={jsonConnection} />
        </div>
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Table" />
            <Tab label="Charts" />
          </Tabs>
        </AppBar>
        <TabPanel value={selectedTab} index={0}>
          <SeparationTable rows={rows} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <SeparationCharts rows={rows} />
        </TabPanel>
      </Grid>
    </Grid>
  );
}
