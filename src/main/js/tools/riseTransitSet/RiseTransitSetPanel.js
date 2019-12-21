import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <div className={classes.area}>
          <RiseTransitSetForm updateRiseTransitSetEvents={setRiseTransitSetEvents} />
        </div>
        <div className={classes.area}>
          <RiseTransitSetTable riseTransitSetEvents={riseTransitSetEvents} />
        </div>
      </Grid>
    </Grid>
  );
}
