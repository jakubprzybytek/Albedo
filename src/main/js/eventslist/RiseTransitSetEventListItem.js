import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import { BodyChip, CatalogueEntryChip } from '../components/Chips';

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

function FormatEventTypeCopy(props) {
  switch (props.event.eventType) {
    case 'ASTRONOMICAL_DAWN' :
      return "Astronomical dawn";
    case 'NAUTICAL_DAWN' :
      return "Nautical dawn";
    case 'CIVIL_DAWN' :
      return "Civil dawn";
    case 'RAISING' :
      return "Raising";
    case 'TRANSIT' :
      return "Transit";
    case 'SETTING' :
      return "Setting";
    case 'CIVIL_DUSK' :
      return "Civil dusk";
    case 'NAUTICAL_DUSK' :
      return "Nautical dusk";
    case 'ASTRONOMICAL_DUSK' :
      return "Astronomical dusk";
  }
  return props.event.eventType;
}

export default function RiseTransitSetEventListItem(props) {

  const { event } = props;

  const classes = useStyles();

  return (
    <ListItem>
      <div className={classes.top}>
        <Typography component="span" variant="body2" className={classes.timeField} color="textPrimary">
          {format(Date.parse(event.time), "HH:mm:ss")}
        </Typography>
        <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
          <FormatEventTypeCopy event={event} /> of <BodyChip bodyDetails={event.bodyDetails} />
        </Typography>
      </div>
    </ListItem>
  );
}
