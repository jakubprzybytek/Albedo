import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import Grid from '@material-ui/core/Grid';
import ConjunctionsForm from './ConjunctionsForm';
import ConjunctionsTable from './ConjunctionsTable';
import ConjunctionCard from './ConjunctionCard';
import BodyCard from '../../components/BodyCard';
import CatalogueEntryCard from '../../components/CatalogueEntryCard';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
  },
}));

export default function ConjunctionsPanel() {

  const [conjunctionEvents, setConjunctionEvents] = React.useState([]);
  const [selectedConjunction, setSelectedConjunction] = React.useState(null);

  const jsonConnection = useJsonConnection(setConjunctionEvents);

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <ConjunctionsForm jsonConnection={jsonConnection} />
        <ConjunctionsTable conjuctionEvents={conjunctionEvents} selectedConjunction={selectedConjunction} setSelectedConjunction={setSelectedConjunction} />
      </Grid>
      <Grid item xs={3}>
        {selectedConjunction && <div>
          <div className={classes.card}>
            <ConjunctionCard conjunction={selectedConjunction} />
          </div>
          <div className={classes.card}>
            {selectedConjunction.firstObjectType === "Body" && selectedConjunction.first && <BodyCard bodyInfo={selectedConjunction.first} />}
          </div>
          <div className={classes.card}>
            {selectedConjunction.secondObjectType === "Body" && selectedConjunction.second && <BodyCard bodyInfo={selectedConjunction.second} />}
            {selectedConjunction.secondObjectType === "CatalogueEntry" && selectedConjunction.second && <CatalogueEntryCard catalogueEntry={selectedConjunction.second} />}
          </div>
        </div>}
      </Grid>
    </Grid>
  );
}
