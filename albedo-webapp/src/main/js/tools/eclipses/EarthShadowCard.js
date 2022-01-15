import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { SlimCardHeader, SlimCardContent } from '../../common/SlimCard';
import { MoonIcon } from '../../components/AstronomicalIcons';

const useStyles = makeStyles(theme => ({
  sectionTitle: {
    textAlign: 'center',
  },
  smallFont: {
    fontSize: '0.8rem',
  },
}));

export default function EarthShadowCard({ objectInfo }) {
  const classes = useStyles();

  return (
    <Card>
      <div className={classes.alwaysVisible}>
        <SlimCardHeader avatar={<Avatar className={classes.avatarYellow}><MoonIcon width={36} height={36} /></Avatar>} title={objectInfo.bodyDetails.name} subheader={objectInfo.bodyDetails.bodyType} />
        <SlimCardContent>
          <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Umbra</Typography>
          <Typography variant="body2" className={classes.smallFont}>
            <span>Radius: </span>
            <Typography component="span" variant="body2" color="textSecondary">
              <React.Fragment>{objectInfo.earthShadow.umbraRadius} km</React.Fragment>
            </Typography>
          </Typography>
          <Typography variant="body2" className={classes.smallFont}>
            <span>Angular Size: </span>
            <Typography component="span" variant="body2" color="textSecondary">
              <React.Fragment>{objectInfo.earthShadow.umbraAngularSize}°</React.Fragment>
            </Typography>
          </Typography>
        </SlimCardContent>
        <SlimCardContent>
          <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Penumbra</Typography>
          <Typography variant="body2" className={classes.smallFont}>
            <span>Penumbra: </span>
            <Typography component="span" variant="body2" color="textSecondary">
              <React.Fragment>{objectInfo.earthShadow.penumbraRadius} km</React.Fragment>
            </Typography>
          </Typography>
          <Typography variant="body2" className={classes.smallFont}>
            <span>Angular Size: </span>
            <Typography component="span" variant="body2" color="textSecondary">
              <React.Fragment>{objectInfo.earthShadow.penumbraAngularSize}°</React.Fragment>
            </Typography>
          </Typography>
        </SlimCardContent>
      </div>
    </Card>
  );
}
