import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import NightChartForm from './NightChartForm';
import NightChart from './NightChart';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function NightChartPanel() {

  const [altitudesResponse, setAltitudesResponse] = React.useState({ timeSeries: [], altitudeSeries: [], sunRiseTransitSetEvents: [] });

  const jsonConnection = useJsonConnection(setAltitudesResponse);
  
  useEffect(() => {
    jsonConnection.performAutoSubmitIfNeeded();
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.area}>
        <NightChartForm jsonConnection={jsonConnection} />
      </div>
      <div className={classes.area}>
        <NightChart altitudesResponse={altitudesResponse} />
      </div>
    </div>
  );
}