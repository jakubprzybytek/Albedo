import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { format } from 'date-fns';
import { BodyChip, CatalogueEntryChip, LocalTimeChip, LowResAngleChip } from '../components/Chips';
import { formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  top: {
    display: 'flex',
    height: 32,
    alignItems: 'center',
  },
  timeField: {
    width: 80,
    display: 'flex',
  },
   inline: {
     display: 'flex',
   }
}));

function FormatEventCopy(props) {

  const { event } = props;

  switch (event.eventType) {
    case 'AstronomicalDawn' :
      return (<React.Fragment>Astronomical dawn of <BodyChip bodyDetails={event.bodyDetails} /></React.Fragment>);
    case 'NauticalDawn' :
      return (<React.Fragment>Nautical dawn of <BodyChip bodyDetails={event.bodyDetails} /></React.Fragment>);
    case 'CivilDawn' :
      return (<React.Fragment>Civil dawn of <BodyChip bodyDetails={event.bodyDetails} /></React.Fragment>);
    case 'Raising' :
      return (<React.Fragment>Raising of <BodyChip bodyDetails={event.bodyDetails} /> on azimuth of: <LowResAngleChip angle={event.azimuth} /></React.Fragment>);
    case 'Transit' :
      return (<React.Fragment>Transit of <BodyChip bodyDetails={event.bodyDetails} /> at altitude of: <LowResAngleChip angle={event.altitude} /></React.Fragment>);
    case 'Setting' :
      return (<React.Fragment>Setting of <BodyChip bodyDetails={event.bodyDetails} /> on azimuth of: <LowResAngleChip angle={event.azimuth} /></React.Fragment>);
    case 'CivilDusk' :
      return (<React.Fragment>Civil dusk of <BodyChip bodyDetails={event.bodyDetails} /></React.Fragment>);
    case 'NauticalDusk' :
      return (<React.Fragment>Nautical dusk of <BodyChip bodyDetails={event.bodyDetails} /></React.Fragment>);
    case 'AstronomicalDusk' :
      return (<React.Fragment>Astronomical dusk of <BodyChip bodyDetails={event.bodyDetails} /></React.Fragment>);
  }
  return props.event.eventType;
}

export default function RiseTransitSetEventListItem(props) {

  const { event } = props;

  const classes = useStyles();

  return (
    <ListItem>
      <div className={classes.top}>
        <Typography component="span" variant="body2" className={classes.inline}>
          <LocalTimeChip time={event.localTime} jd={event.jde} />
        </Typography>
        <Typography component="span" variant="body2" className={classes.inline}>
          <FormatEventCopy event={event} />
        </Typography>
      </div>
    </ListItem>
  );
}
