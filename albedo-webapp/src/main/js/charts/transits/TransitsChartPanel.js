import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import TransitsChartForm from './TransitsChartForm';
import TransitsChart from './TransitsChart';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function TransitsChartPanel() {

  const [transitsResponse, setTransitsResponse] = React.useState({ timeSeries: [], transitsSeries: [] });

  const jsonConnection = useJsonConnection(setTransitsResponse);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.area}>
        <TransitsChartForm jsonConnection={jsonConnection} />
      </div>
      <div className={classes.area}>
        <TransitsChart transitsResponse={transitsResponse} />
      </div>
    </div>
  );
}