import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { format } from 'date-fns';
import { BodyChip, CatalogueEntryChip, LocalTimeChip, LowResAngleChip } from '../../components/Chips';
import { formatDegrees, formatArcSeconds } from '../../utils/Angles';

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


function BodyInfo(props) {

  const { bodyInfo } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <BodyChip bodyDetails={bodyInfo.bodyDetails} />
      ({bodyInfo.ephemeris.apparentMagnitude} mag{bodyInfo.ephemeris.angularSize && <React.Fragment>, θ={formatArcSeconds(bodyInfo.ephemeris.angularSize)}</React.Fragment>})
    </React.Fragment>
  );
}

function FormatEventCopy(props) {

  const { conjunction } = props;

  return (
    <React.Fragment>
      Conjunction between <BodyInfo bodyInfo={conjunction.first} /> and
      {conjunction.secondObjectType === 'Body' && <BodyInfo bodyInfo={conjunction.second} />}
      {conjunction.secondObjectType === 'CatalogueEntry' && <CatalogueEntryChip catalogueEntry={conjunction.second} />
      } with separation of {formatDegrees(conjunction.separation)}
    </React.Fragment>
  );
}

export default function ConjunctionEventListItem(props) {

  const { event } = props;

  const classes = useStyles();

  return (
    <div className={classes.top}>
      <Typography component="span" variant="body2" className={classes.timeField}>
        <LocalTimeChip time={event.localTime} jd={event.jde} />
      </Typography>
      <Typography component="span" variant="body2" className={classes.inline}>
        <FormatEventCopy conjunction={event} />
      </Typography>
    </div>
  );
}
