import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { LocalTimeChip } from '../components/Chips';

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
  mainField: {
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
}));

export default function ExpandableEventListItem(props) {

  const { event, expanded, toggleHandler, children, expandedPanel } = props;

  const classes = useStyles();

  return (
    <div className={classes.top}>
      <div className={classes.header} onClick={toggleHandler}>
        <Typography component="span" variant="body2" className={classes.timeField}>
          <LocalTimeChip time={event.localTime} jd={event.jde} />
        </Typography>
        <Typography component="span" variant="body2" className={classes.mainField}>
          {children}
        </Typography>
        <Typography component="span" variant="body2" className={classes.scoreField}>
          {event.score}
        </Typography>
      </div>
      {expanded && <div className={classes.detailsBanner}>
        {expandedPanel}
      </div>}
    </div>
  );
}
