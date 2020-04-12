import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { blue } from '@material-ui/core/colors';

import { SlimCardHeader, SlimCardContent } from '../common/SlimCard';
import { formatHourAngle, formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  avatar: {
    backgroundColor: blue[300],
  },
  sectionTitle: {
    textAlign: 'center',
  },
  inline: {
    display: 'inline',
    fontSize: '0.8rem',
  },
}));

export default function CatalogueEntryCard(props) {

  const { catalogueEntry } = props;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <SlimCardHeader avatar={<Avatar className={classes.avatar}>C</Avatar>}
        title={catalogueEntry.name}
        subheader={"Catalogue Entry: " + catalogueEntry.type} />
      <SlimCardContent>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Catalogue data</Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>RA (α): </span>
          <Typography component="span" variant="body2" color="textSecondary">
            <Tooltip title={catalogueEntry.coordinates.rightAscension.toFixed(6) + "° (J2000)"}>
              <React.Fragment>{formatHourAngle(catalogueEntry.coordinates.rightAscension)}</React.Fragment>
            </Tooltip>
          </Typography>
        </Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Dec (δ): </span>
          <Typography component="span" variant="body2" color="textSecondary">
            <Tooltip title={catalogueEntry.coordinates.declination.toFixed(6) + "° (J2000)"}>
              <span>{formatDegrees(catalogueEntry.coordinates.declination)}</span>
            </Tooltip>
          </Typography>
        </Typography>
        {(catalogueEntry.bMagnitude || catalogueEntry.vMagnitude) && <Typography variant="body2" className={classes.smallFont}>
          <span>Magnitude: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {catalogueEntry.bMagnitude && catalogueEntry.bMagnitude + " (B)"} {catalogueEntry.vMagnitude && catalogueEntry.vMagnitude + " (V)"}
          </Typography>
        </Typography>}
        {(catalogueEntry.majorAxisSize || catalogueEntry.minorAxisSize) && <Typography variant="body2" className={classes.smallFont}>
          <span>Angular size (θ): </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {catalogueEntry.majorAxisSize && catalogueEntry.majorAxisSize + "'"}{catalogueEntry.minorAxisSize && " x " + catalogueEntry.minorAxisSize + "'"}
          </Typography>
        </Typography>}
        {catalogueEntry.morphologicalType && <Typography variant="body2" className={classes.smallFont}>
          <span>Morphological type: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {catalogueEntry.morphologicalType}
          </Typography>
        </Typography>}
      </SlimCardContent>
    </Card>
  );
}
