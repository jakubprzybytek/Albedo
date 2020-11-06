import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import Grid from '@material-ui/core/Grid';
import RiseTransitSetForm from './RiseTransitSetForm';
import RiseTransitSetTable from './RiseTransitSetTable';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function RiseTransitSetPanel() {

  const [riseTransitSetEvents, setRiseTransitSetEvents] = React.useState([]);

  const jsonConnection = useJsonConnection(setRiseTransitSetEvents);

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <div className={classes.area}>
          <RiseTransitSetForm jsonConnection={jsonConnection} />
        </div>
        <div className={classes.area}>
          <RiseTransitSetTable riseTransitSetEvents={riseTransitSetEvents} />
        </div>
      </Grid>
    </Grid>
  );
}
