import React from 'react';
import Grid from '@material-ui/core/Grid';
import EphemerisForm from './EphemerisForm';
import EphemerisTable from './EphemerisTable';
import BodyCard from './BodyCard';

export default function EphemerisPanel() {

  const defaultBodyCard = {
    bodyDetails: {
      name: "n/a"
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
      <Grid item xs={8}>
        <EphemerisForm updateRows={setRows} updateBodyCard={updateBodyCard} />
        <EphemerisTable rows={rows} />
      </Grid>
      <Grid item xs={4}>
        <BodyCard bodyCard={bodyCard} />
      </Grid>
    </Grid>
  );
}
