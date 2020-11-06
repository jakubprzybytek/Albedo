import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import VisibilityChartForm from './VisibilityChartForm';
import VisibilityChart from './VisibilityChart';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function VisibilityChartPanel() {

  const [visibilityChartResponse, setVisibilityChartResponse] = React.useState({ 
    sunSets:[], 
    sunCivilDusks: [], 
    sunNauticalDusks: [], 
    sunAstronomicalDusks: [], 
    sunAstronomicalDawns: [],
    sunNauticalDawns: [],
    sunCivilDawns: [],
    sunRises: [],
    sunRiseTransitSetEvents: [],
    bodies: [] });

  const jsonConnection = useJsonConnection(setVisibilityChartResponse);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.area}>
        <VisibilityChartForm jsonConnection={jsonConnection} />
      </div>
      <div className={classes.area} style={{height: '1000px'}}>
        <VisibilityChart visibilityChartData={visibilityChartResponse} />
      </div>
    </div>
  );
}