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

  const [rows, setRows] = React.useState([]);
  const [conjunction, setConjunction] = React.useState(null);

  const jsonConnection = useJsonConnection(setRows);

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <ConjunctionsForm jsonConnection={jsonConnection} />
        <ConjunctionsTable rows={rows} onConjunctionSelected={setConjunction} />
      </Grid>
      <Grid item xs={3}>
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
