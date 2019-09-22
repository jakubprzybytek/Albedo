import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import EphemerisForm from './EphemerisForm';
import EphemerisTable from './EphemerisTable';
import format from 'date-fns/format';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block'
  }
}));

export default function EphemerisPanel() {

  const [rows, setRows] = React.useState([]);

  function fetchData(ephParams) {
    axios.get('http://localhost:8080/api/ephemeris', {
        params: {
          body: ephParams.bodyName,
          from: format(ephParams.fromDate, "yyyy-MM-dd"),
          to: format(ephParams.toDate, "yyyy-MM-dd"),
          interval: ephParams.interval
        }
      })
      .then(res => {
        const ephemerisList = res.data.ephemerisList;
        setRows(ephemerisList);
      });
  }

  const classes = useStyles();

  return (
    <Grid className={classes.root} container direction="column">
      <EphemerisForm submitForm={fetchData} />
      <EphemerisTable rows={rows} />
    </Grid>
  );
}
