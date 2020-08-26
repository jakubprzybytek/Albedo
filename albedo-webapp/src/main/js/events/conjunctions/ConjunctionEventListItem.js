import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BodyChip, CatalogueEntryChip, LocalTimeChip, ElongationChip } from '../../components/Chips';
import BodyCard from '../../components/BodyCard';
import CatalogueEntryCard from '../../components/CatalogueEntryCard';
import { formatDegrees, formatArcSeconds } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  top: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'start',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: 32,
    alignItems: 'center',
    cursor: 'pointer'
  },
  timeField: {
    width: 80,
    display: 'flex',
  },
  inline: {
    display: 'flex',
    flexGrow: 1,
  },
  scoreField: {
    width: 12,
    display: 'flex',
  },
  detailsBanner: {
    display: 'flex',
    flexDirection: 'row',
  },
  card: {
    margin: theme.spacing(1, 1, 0.5, 1),
  }
}));

function ConjunctionEventCopy(props) {

  const { conjunction } = props;

  const sunInvolved = (conjunction.firstObjectType === 'Body' && conjunction.first.bodyDetails.name === 'Sun') ||
    (conjunction.secondObjectType === 'Body' && conjunction.second.bodyDetails.name === 'Sun');

  function BodyInfo(props) {

    const { bodyInfo } = props;

    return (
      <React.Fragment>
        <BodyChip bodyDetails={bodyInfo.bodyDetails} />
          ({bodyInfo.ephemeris.apparentMagnitude} mag{bodyInfo.ephemeris.angularSize && <React.Fragment>, θ={formatArcSeconds(bodyInfo.ephemeris.angularSize)}</React.Fragment>})
        </React.Fragment>
    );
  }

  function Elongation() {
    return (
      <React.Fragment>
        Elongation {conjunction.secondObjectType !== 'Body' || conjunction.first.ephemeris.elongation < conjunction.second.ephemeris.elongation ?
          <ElongationChip elongation={conjunction.first.ephemeris.elongation} showDayTime={true} /> :
          <ElongationChip elongation={conjunction.second.ephemeris.elongation} showDayTime={true} />}.
        </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      Conjunction between <BodyInfo bodyInfo={conjunction.first} /> and
      {conjunction.secondObjectType === 'Body' && <BodyInfo bodyInfo={conjunction.second} />}
      {conjunction.secondObjectType === 'CatalogueEntry' && <CatalogueEntryChip catalogueEntry={conjunction.second} />
      } with separation of {formatDegrees(conjunction.separation)} (separation factor is {conjunction.separationFactor}).
      {!sunInvolved && <Elongation />}
    </React.Fragment>
  );
}

export default function ConjunctionEventListItem(props) {

  const { event, eventSelect, eventSelected } = props;

  const classes = useStyles();

  return (
    <div className={classes.top}>
      <div className={classes.header} onClick={eventSelect(event.id)}>
        <Typography component="span" variant="body2" className={classes.timeField}>
          <LocalTimeChip time={event.localTime} jd={event.jde} />
        </Typography>
        <Typography component="span" variant="body2" className={classes.inline}>
          <ConjunctionEventCopy conjunction={event} />
        </Typography>
        <Typography component="span" variant="body2" className={classes.scoreField}>
          {event.score}
        </Typography>
      </div>
      {eventSelected && <div className={classes.detailsBanner}>
        <div className={classes.card}>
          <BodyCard bodyInfo={event.first} />
        </div>
        <div className={classes.card}>
          {event.secondObjectType === 'Body' && <BodyCard bodyInfo={event.second} />}
          {event.secondObjectType === 'CatalogueEntry' && <CatalogueEntryCard catalogueEntry={event.second} />}
        </div>
      </div>}
    </div>
  );
}
