import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { grey, blue, red } from '@material-ui/core/colors';
import RiseTransitSetEventListItem from './riseTransitSet/RiseTransitSetEventListItem';
import ConjunctionEventListItem from './conjunctions/ConjunctionEventListItem';
import EclipseEventListItem from './eclipses/EclipseEventListItem';

const useStyles = makeStyles(theme => ({
  list: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    //maxHeight: 1200,
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '1.4rem',
    color: blue[700],
  },
  listRow: {
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.background.default,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: '0 0 2px 0',
  },
  subheader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.4rem',
    color: grey[700],
    backgroundColor: grey[100],
    paddingLeft: 32,
    cursor: 'pointer'
  },
  collapsed: {
    color: grey[400],
    backgroundColor: grey[200],
  },
  hidden: {
    display: 'none'
  },
  RiseTransitSet: {
    backgroundColor: blue[50],
  },
  Conjunction: {
    backgroundColor: red[50],
  },
  Eclipse: {
    backgroundColor: grey[400],
  },
}));

export default function EventsListPanel(props) {

  const { groupedEvents, children } = props;

  const [eventsGroupsExpanded, setEventsGroupsExpanded] = React.useState({});
  const [eventsExpanded, setEventsExpanded] = React.useState({});

  const classes = useStyles();
 
  function EventSelect(props) {

    const { event, expanded, toggleHandler } = props;

    return (
      <ListItem className={clsx(classes.listRow, classes[event.type])}>
        {event.type === "RiseTransitSet" && <RiseTransitSetEventListItem event={event} />}
        {event.type === "Conjunction" && <ConjunctionEventListItem event={event} expanded={expanded} toggleHandler={toggleHandler} />}
        {event.type === "Eclipse" && <EclipseEventListItem event={event} expanded={expanded} toggleHandler={toggleHandler} />}
      </ListItem>
    );
  }

  function toggleEvent(eventId) {
    setEventsExpanded({...eventsExpanded, [eventId]: eventId in eventsExpanded ? !eventsExpanded[eventId] : true });
  }

  function eventExpanded(eventId) {
    return eventsExpanded[eventId] === true;
  }
  function toggleEventsGroup(eventsGroupName) {
    setEventsGroupsExpanded({...eventsGroupsExpanded, [eventsGroupName]: eventsGroupName in eventsGroupsExpanded ? !eventsGroupsExpanded[eventsGroupName] : false });
  }

  function eventsGroupExpanded(eventsGroupName) {
    return eventsGroupsExpanded[eventsGroupName] !== false;
  }

  return (
    <List dense={true} className={classes.list}>
      <ListSubheader className={classes.listHeader}>
        {children}
      </ListSubheader>
      {Object.keys(groupedEvents).map(eventsGroupName => (
        <li key={eventsGroupName} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={clsx(classes.subheader, !eventsGroupExpanded(eventsGroupName) && classes.collapsed)} onClick={() => { toggleEventsGroup(eventsGroupName) } }>
              {eventsGroupName}
              {eventsGroupExpanded(eventsGroupName) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListSubheader>
            {eventsGroupExpanded(eventsGroupName) && groupedEvents[eventsGroupName].events.map(event => (
              <EventSelect key={event.id}
                event={event}
                expanded={eventExpanded(event.id)}
                toggleHandler={() => toggleEvent(event.id) } />
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}
