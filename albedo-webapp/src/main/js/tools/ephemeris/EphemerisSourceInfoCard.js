import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { SlimCardHeader, SlimCardContent } from '../../common/SlimCard';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2)
  },
  sectionTitle: {
    textAlign: 'center',
  },
  smallFont: {
    fontSize: '0.8rem',
  },
}));

export default function EphemerisSourceInfoCard(props) {

  const { engineInfo } = props;

  const classes = useStyles();

  return (
    <Card>
      <SlimCardHeader title={'Ephemeris'} />
      <SlimCardContent>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Source</Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Engine: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {engineInfo}
          </Typography>
        </Typography>
      </SlimCardContent>
    </Card>
  );
}
