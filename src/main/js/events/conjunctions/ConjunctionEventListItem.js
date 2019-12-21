import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BodyChip, CatalogueEntryChip, LocalTimeChip, ElongationChip } from '../../components/Chips';
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

  return (
    <React.Fragment>
      <BodyChip bodyDetails={bodyInfo.bodyDetails} />
      ({bodyInfo.ephemeris.apparentMagnitude} mag{bodyInfo.ephemeris.angularSize && <React.Fragment>, θ={formatArcSeconds(bodyInfo.ephemeris.angularSize)}</React.Fragment>})
    </React.Fragment>
  );
}

function Elongation(props) {

  const { conjunction } = props;

  return (
    <React.Fragment>
      Elongation {conjunction.secondObjectType !== 'Body' || conjunction.first.ephemeris.elongation < conjunction.second.ephemeris.elongation ?
        <ElongationChip elongation={conjunction.first.ephemeris.elongation} showDayTime={true} /> :
        <ElongationChip elongation={conjunction.second.ephemeris.elongation} showDayTime={true} />}.
    </React.Fragment>
  );
}

function RtsEventCopy(props) {

  const { conjunction } = props;

  const sunInvolved = (conjunction.firstObjectType === 'Body' && conjunction.first.bodyDetails.name === 'Sun') ||
    (conjunction.secondObjectType === 'Body' && conjunction.second.bodyDetails.name === 'Sun');

  return (
    <React.Fragment>
      Conjunction between <BodyInfo bodyInfo={conjunction.first} /> and
      {conjunction.secondObjectType === 'Body' && <BodyInfo bodyInfo={conjunction.second} />}
      {conjunction.secondObjectType === 'CatalogueEntry' && <CatalogueEntryChip catalogueEntry={conjunction.second} />
      } with separation of {formatDegrees(conjunction.separation)}.
      {!sunInvolved && <Elongation conjunction={conjunction} />}
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
        <RtsEventCopy conjunction={event} />
      </Typography>
    </div>
  );
}
