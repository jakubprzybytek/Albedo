import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import Grid from '@material-ui/core/Grid';
import EclipsesForm from './EclipsesForm';
import EclipsesTable from './EclipsesTable';
import EclipseCard from './EclipseCard';
import BodyCard from '../../components/BodyCard';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

export default function EclipsesPanel() {
  
  const [eclipseEvents, setEclipseEvents] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState();

  const jsonConnection = useJsonConnection((data) => {
    setEclipseEvents(data); 
    setSelectedEvent(null);
  });

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <div className={classes.area}>
          <EclipsesForm jsonConnection={jsonConnection} />
        </div>
        <div className={classes.area}>
          <EclipsesTable eclipseEvents={eclipseEvents} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
        </div>
      </Grid>
      <Grid item xs={3}>
        {selectedEvent && <div>
          <div className={classes.card}>
            <EclipseCard eclipse={selectedEvent} />
          </div>
          <div className={classes.card}>
            <BodyCard bodyInfo={selectedEvent.sun} />
          </div>
          <div className={classes.card}>
            <BodyCard bodyInfo={selectedEvent.moon} />
          </div>
        </div>}
      </Grid>
    </Grid>
  );
}
