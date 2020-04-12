import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../common/TabPanel';
import DsoCataloguePanel from './dso/DsoCataloguePanel';

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

export default function CataloguesPanel() {

  const [value, setValue] = React.useState(0);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange} aria-label="Vertical tabs example" className={classes.tabs}>
        <Tab label="DSO" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <DsoCataloguePanel />
      </TabPanel>
    </div>
  );
}