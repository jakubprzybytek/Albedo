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
import { buildEventsListToggleDaySectionAction, buildFutureEventsListToggleDaySectionAction } from './actions/EventsListActions';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    //maxHeight: 1200,
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
    fontSize: '1.2rem',
    color: blue[800],
    backgroundColor: grey[300],
    paddingLeft: 32,
    cursor: 'pointer'
  },
  expanded: {
    backgroundColor: grey[100],
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

  const { eventsGroups, futureEventsGroups, toggleDaySection, toggleFutureDaySection } = props;

  const classes = useStyles();

  function EventSelect(props) {

    const { event, sectionExpanded } = props;

    return (
      <ListItem className={clsx(classes.listRow, classes[event.type], !sectionExpanded && classes.hidden)}>
        {event.type === "RiseTransitSet" && <RiseTransitSetEventListItem event={event} />}
        {event.type === "Conjunction" && <ConjunctionEventListItem event={event} />}
      </ListItem>
    );
  }

  const toggleDaySectionHandle = (daySection) => () => {
    toggleDaySection(daySection);
  }

  const toggleFutureDaySectionHandle = (daySection) => () => {
    toggleFutureDaySection(daySection);
  }

  return (
    <Paper className={classes.paper}>
      <List dense={true} className={classes.list} subheader={<li />}>
        {Object.keys(eventsGroups).map(daySection => (
          <li key={daySection} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={clsx(classes.subheader, eventsGroups[daySection].expanded && classes.expanded)} onClick={toggleDaySectionHandle(daySection)}>
                {daySection}
                {eventsGroups[daySection].expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListSubheader>
              {eventsGroups[daySection].events.map(event => (
                <EventSelect key={event.id} event={event} sectionExpanded={eventsGroups[daySection].expanded} />
              ))}
            </ul>
          </li>
        ))}
      </List>
      <List dense={true} className={classes.list} subheader={<li />}>
        {Object.keys(futureEventsGroups || {}).map(daySection => (
          <li key={daySection} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={clsx(classes.subheader, futureEventsGroups[daySection].expanded && classes.expanded)} onClick={toggleFutureDaySectionHandle(daySection)}>
                {daySection}
                {futureEventsGroups[daySection].expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListSubheader>
              {futureEventsGroups[daySection].events.map(event => (
                <EventSelect key={event.id} event={event} sectionExpanded={futureEventsGroups[daySection].expanded} />
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
    futureEventsGroups: state.eventsList.futureEvents
  }),
  dispatch => ({
    toggleDaySection: (daySection) => {
      dispatch(buildEventsListToggleDaySectionAction(daySection));
    },
    toggleFutureDaySection: (daySection) => {
      dispatch(buildFutureEventsListToggleDaySectionAction(daySection));
    }
  })
)(EventsList);

export default StateAwareEventsList;