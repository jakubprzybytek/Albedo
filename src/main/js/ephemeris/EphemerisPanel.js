import React from 'react';
import Grid from '@material-ui/core/Grid';
import EphemerisForm from './EphemerisForm';
import EphemerisTable from './EphemerisTable';
import BodyCard from '../components/BodyCard';

export default function EphemerisPanel() {

  const defaultBodyCard = {
    bodyDetails: {
      name: "n/a",
      bodyType: "?"
    },
    orbitElements: {
      epoch: 'n/a',
      eccentricity: 'n/a',
      semiMajorAxis: 'n/a',
      meanMotion: 'n/a',
      argumentOfPerihelion: 'n/a',
      longitudeOfAscendingNode: 'n/a',
      inclination: 'n/a',
      meanAnomalyEpoch: 'n/a',
      meanAnomalyAtEpoch: 'n/a'
    },
    magnitudeParameters: {
      H: 'n/a',
      G: 'n/a'
    }, ...{}
  };

  const [rows, setRows] = React.useState([]);
  const [bodyCard, setBodyCard] = React.useState(defaultBodyCard);

  function updateBodyCard(newBodyCard) {
    setBodyCard({...defaultBodyCard, ...newBodyCard});
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <EphemerisForm updateRows={setRows} updateBodyCard={updateBodyCard} />
        <EphemerisTable rows={rows} />
      </Grid>
      <Grid item xs={3}>
        <BodyCard bodyInfo={bodyCard} />
      </Grid>
    </Grid>
  );
}
