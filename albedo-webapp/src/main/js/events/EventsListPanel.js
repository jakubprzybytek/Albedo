import React from 'react';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import EventsList from './EventsList';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
  },
}));

function EventsListPanel(props) {

  const { eventsGroups, futureEventsGroups } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <EventsList groupedEvents={eventsGroups}>
        Now
      </EventsList>
      <EventsList groupedEvents={futureEventsGroups || {}}>
        Later
      </EventsList>
    </Paper>
  );
}

const StateAwareEventsList = connect(
  state => ({
    eventsGroups: state.eventsList.events,
    futureEventsGroups: state.eventsList.futureEvents,
  })
)(EventsListPanel);

export default StateAwareEventsList;