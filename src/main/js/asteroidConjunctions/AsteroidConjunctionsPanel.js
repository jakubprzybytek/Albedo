import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import format from 'date-fns/format';
import AsteroidConjunctionsForm from './AsteroidConjunctionsForm';
import AsteroidConjunctionsTable from './AsteroidConjunctionsTable';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block'
  }
}));

export default function AsteroidConjunctionsPanel() {

  const [rows, setRows] = React.useState([]);

  function fetchData(conjParams) {
    axios.get('http://localhost:8080/api/asteroidConjunctions', {
        params: {
          from: format(conjParams.fromDate, "yyyy-MM-dd"),
          to: format(conjParams.toDate, "yyyy-MM-dd")
        }
      })
      .then(res => {
        const conjList = res.data;
        setRows(conjList);
      });
  }

  const classes = useStyles();

  return (
    <Grid className={classes.root} container direction="column">
      <AsteroidConjunctionsForm submitForm={fetchData} />
      <AsteroidConjunctionsTable rows={rows} />
    </Grid>
  );
}
