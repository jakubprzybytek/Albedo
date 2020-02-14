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
import RiseTransitSetEventListItem from './RiseTransitSet/RiseTransitSetEventListItem';
import ConjunctionEventListItem from './conjunctions/ConjunctionEventListItem';
import {
  buildEventsListToggleDaySectionAction,
  buildFutureEventsListToggleDaySectionAction,
  buildEventsListToggleEventAction,
  buildFutureEventsListToggleEventAction
} from './actions/EventsListActions';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
  },
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
}));

function EventsList(props) {

  const {
    eventsGroups, eventProps, toggleDaySection, toggleEvent,
    futureEventsGroups, futureEventProps, toggleFutureDaySection, toggleFutureEvent
  } = props;

  const classes = useStyles();

  const toggleDaySectionHandle = (daySection) => () => {
    toggleDaySection(daySection);
  }

  const toggleFutureDaySectionHandle = (daySection) => () => {
    toggleFutureDaySection(daySection);
  }

  const toggleEventHandle = (eventId) => () => {
    toggleEvent(eventId);
  }

  const toggleFutureEventHandle = (eventId) => () => {
    toggleFutureEvent(eventId);
  }

  function EventSelect(props) {

    const { event, eventSelectFunction, eventSelected, sectionExpanded } = props;

    return (
      <ListItem className={clsx(classes.listRow, classes[event.type], !sectionExpanded && classes.hidden)}>
        {event.type === "RiseTransitSet" && <RiseTransitSetEventListItem event={event} />}
        {event.type === "Conjunction" && <ConjunctionEventListItem event={event} eventSelect={eventSelectFunction} eventSelected={eventSelected} />}
      </ListItem>
    );
  }

  return (
    <Paper className={classes.paper}>
      <List dense={true} className={classes.list}>
        <ListSubheader className={classes.listHeader}>
          Now
        </ListSubheader>
        {Object.keys(eventsGroups).map(daySection => (
          <li key={daySection} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={clsx(classes.subheader, !eventsGroups[daySection].expanded && classes.collapsed)} onClick={toggleDaySectionHandle(daySection)}>
                {daySection}
                {eventsGroups[daySection].expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListSubheader>
              {eventsGroups[daySection].events.map(event => (
                <EventSelect key={event.id}
                  event={event}
                  sectionExpanded={eventsGroups[daySection].expanded}
                  eventSelectFunction={toggleEventHandle}
                  eventSelected={eventProps[event.id].expanded} />
              ))}
            </ul>
          </li>
        ))}
      </List>
      <List dense={true} className={classes.list}>
        <ListSubheader className={classes.listHeader}>
          Later
        </ListSubheader>
        {Object.keys(futureEventsGroups || {}).map(daySection => (
          <li key={daySection} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={clsx(classes.subheader, !futureEventsGroups[daySection].expanded && classes.collapsed)} onClick={toggleFutureDaySectionHandle(daySection)}>
                {daySection}
                {futureEventsGroups[daySection].expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListSubheader>
              {futureEventsGroups[daySection].events.map(event => (
                <EventSelect key={event.id}
                  event={event}
                  sectionExpanded={futureEventsGroups[daySection].expanded}
                  eventSelectFunction={toggleFutureEventHandle}
                  eventSelected={futureEventProps[event.id].expanded} />
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Paper>
  );
}

const StateAwareEventsList = connect(
  state => ({
    eventsGroups: state.eventsList.events,
    eventProps: state.eventsList.eventProps,
    futureEventsGroups: state.eventsList.futureEvents,
    futureEventProps: state.eventsList.futureEventProps,
  }),
  dispatch => ({
    toggleDaySection: (daySection) => {
      dispatch(buildEventsListToggleDaySectionAction(daySection));
    },
    toggleFutureDaySection: (daySection) => {
      dispatch(buildFutureEventsListToggleDaySectionAction(daySection));
    },
    toggleEvent: (eventId) => {
      dispatch(buildEventsListToggleEventAction(eventId));
    },
    toggleFutureEvent: (eventId) => {
      dispatch(buildFutureEventsListToggleEventAction(eventId));
    },
  })
)(EventsList);

export default StateAwareEventsList;