import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandableEventListItem from '../ExpandableEventListItem';
import BodyCard from '../../components/BodyCard';
import EclipseCard from '../../tools/eclipses/EclipseCard';
import { formatDegrees } from '../../utils/Angles';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(1, 1, 0.5, 1),
  }
}));

export default function EclipseEventListItem(props) {

  const { event, expanded, toggleHandler } = props;

  const classes = useStyles();

  const expandedPanel = (
    <React.Fragment>
      <div className={classes.card}>
        <EclipseCard eclipse={event} />
      </div>
      <div className={classes.card}>
        <BodyCard bodyInfo={event.sun} />
      </div>
      <div className={classes.card}>
        <BodyCard bodyInfo={event.moon} />
      </div>
    </React.Fragment>
  );

  return (
    <ExpandableEventListItem event={event} expanded={expanded} toggleHandler={toggleHandler} expandedPanel={expandedPanel}>
      Sun Eclipse with separation of {formatDegrees(event.separation)}.
    </ExpandableEventListItem>
  );
}
