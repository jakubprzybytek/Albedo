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
  
  const [eclipseEvents, setEclipseEvents] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState();

  const jsonConnection = useJsonConnection((data) => {
    setEclipseEvents(data); 
    setSelectedEvent(null);
  });

  const classes = useStyles();

const conjunction = null;

  return (
    <Grid container spacing={2}>
      <Grid item xm={9}>
        <div className={classes.area}>
          <EclipsesForm jsonConnection={jsonConnection} />
        </div>
        <div className={classes.area}>
          <EclipsesTable eclipseEvents={eclipseEvents} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
        </div>
      </Grid>
      <Grid item xm={3}>
        {conjunction && <div>
          <div className={classes.card}>
            <ConjunctionCard conjunction={conjunction} />
          </div>
          <div className={classes.card}>
            {conjunction.firstObjectType === "Body" && conjunction.first && <BodyCard bodyInfo={conjunction.first} />}
          </div>
          <div className={classes.card}>
            {conjunction.secondObjectType === "Body" && conjunction.second && <BodyCard bodyInfo={conjunction.second} />}
            {conjunction.secondObjectType === "CatalogueEntry" && conjunction.second && <CatalogueEntryCard catalogueEntry={conjunction.second} />}
          </div>
        </div>}
      </Grid>
    </Grid>
  );
}
