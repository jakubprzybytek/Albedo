import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BodyCard from '../../components/BodyCard';
import BrightCometsForm from './BrightCometsForm';
import BrightCometsTable from './BrightCometsTable';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function BrightCometsPanel() {

  const [brightComets, setBrightComets] = React.useState([]);
  const [bodyInfo, setBodyInfo] = React.useState();

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <div className={classes.area}>
          <BrightCometsForm updateBrightComets={setBrightComets} />
        </div>
        <div className={classes.area}>
          <BrightCometsTable brightComets={brightComets} onCometSelected={setBodyInfo} />
        </div>
      </Grid>
      <Grid item xs={3}>
        <BodyCard bodyInfo={bodyInfo} />
      </Grid>
    </Grid>
  );
}
