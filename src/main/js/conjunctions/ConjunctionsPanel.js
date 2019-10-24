import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ConjunctionsForm from './ConjunctionsForm';
import ConjunctionsTable from './ConjunctionsTable';
import ConjunctionCard from './ConjunctionCard';
import BodyCard from '../components/BodyCard';
import CatalogueEntryCard from '../components/CatalogueEntryCard';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
  },
}));

export default function ConjunctionsPanel() {

  const [rows, setRows] = React.useState([]);
  const [conjunction, setConjunctionCard] = React.useState({});

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <ConjunctionsForm updateRows={setRows} />
        <ConjunctionsTable rows={rows} onConjunctionSelected={setConjunctionCard} />
      </Grid>
      <Grid item xs={4}>
        <div className={classes.card}>
          <ConjunctionCard conjunction={conjunction} />
        </div>
        <div className={classes.card}>
          {conjunction.firstObjectType === "Body" && conjunction.first && <BodyCard bodyInfo={ { bodyDetails: conjunction.first } } />}
        </div>
        <div className={classes.card}>
          {conjunction.secondObjectType === "Body" && conjunction.second && <BodyCard bodyInfo={ { bodyDetails: conjunction.second } } />}
          {conjunction.secondObjectType === "CatalogueEntry" && conjunction.second && <CatalogueEntryCard catalogueEntry={conjunction.second} />}
        </div>
      </Grid>
    </Grid>
  );
}
