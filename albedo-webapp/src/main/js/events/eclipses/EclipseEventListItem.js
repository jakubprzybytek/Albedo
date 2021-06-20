import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BodyChip, CatalogueEntryChip, LocalTimeChip, ElongationChip } from '../../components/Chips';
import { formatDegrees } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  top: {
    display: 'flex',
    flexGrow: 1,
    height: 32,
    alignItems: 'center',
  },
  timeField: {
    width: 80,
    display: 'flex',
  },
  mainField: {
    display: 'flex',
    flexGrow: 1,
  },
  scoreField: {
    width: 12,
    display: 'flex',
  },
}));

export default function EclipseEventListItem(props) {

  const { event } = props;

  const classes = useStyles();

  return (
    <div className={classes.top}>
      <Typography component="span" variant="body2" className={classes.timeField}>
        <LocalTimeChip time={event.localTime} jd={event.jde} />
      </Typography>
      <Typography component="span" variant="body2" className={classes.mainField}>
        Sun Eclipse with separation of {formatDegrees(event.separation)}.
      </Typography>
      <Typography component="span" variant="body2" className={classes.scoreField}>
          {event.score}
        </Typography>
    </div>
  );
}
