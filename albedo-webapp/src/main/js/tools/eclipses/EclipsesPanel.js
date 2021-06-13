import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import Grid from '@material-ui/core/Grid';
import EclipsesForm from './EclipsesForm';
import EclipsesTable from './EclipsesTable';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function RiseTransitSetPanel() {

  const [eclipsesEvents, setEclipsesEvents] = React.useState([]);

  const jsonConnection = useJsonConnection(setEclipsesEvents);

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <div className={classes.area}>
          <EclipsesForm jsonConnection={jsonConnection} />
        </div>
        <div className={classes.area}>
          <EclipsesTable eclipsesEvents={eclipsesEvents} />
        </div>
      </Grid>
    </Grid>
  );
}
