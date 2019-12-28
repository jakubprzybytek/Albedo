import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import { grey, blue, red } from '@material-ui/core/colors';
import RiseTransitSetEventListItem from './RiseTransitSet/RiseTransitSetEventListItem';
import ConjunctionEventListItem from './conjunctions/ConjunctionEventListItem';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 1200,
  },
  listRow: {
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.background.default,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  listRowCard: {
    margin: 4,
    boxShadow: `0px 2px 1px -1px rgba(0.0, 0.0, 0.0, 0.01), 0px 1px 1px 0px rgba(0,0,0,0.05), 0px 1px 3px 0px rgba(0,0,0,0.01)`,
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  subheader: {
    fontSize: '1.2rem',
    color: blue[800],
    backgroundColor: grey[50],
    paddingLeft: 32
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

const mapStateToProps = state => {
  return {
    events: state.eventsList,
  };
};

function EventsList(props) {

  const { events } = props;

  const classes = useStyles();

  const eventsByDay = groupByDay(events);

  function groupByDay(flatEventsList) {
    return flatEventsList.reduce(function (eventsByDay, event) {
      let key = event.localTime.substr(0, 10);
      (eventsByDay[key] = eventsByDay[key] || []).push(event);
      return eventsByDay;
    }, {});
  }

  function EventSelect(props) {

    const { event } = props;

    return (
      <ListItem className={clsx(classes.listRow, classes[event.type])}>
        {event.type === "RiseTransitSet" && <RiseTransitSetEventListItem event={event} />}
        {event.type === "Conjunction" && <ConjunctionEventListItem event={event} />}
      </ListItem>
    );
  }

  return (
    <Paper className={classes.paper}>
      <List dense={true} className={classes.list} subheader={<li />}>
        {Object.keys(eventsByDay).map(daySection => (
          <li key={daySection} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.subheader}>{daySection}</ListSubheader>
              {eventsByDay[daySection].map(event => (
                <EventSelect key={event.id} event={event} />
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Paper>
  );
}

const LocationEventsList = connect(
  mapStateToProps
)(EventsList);

export default LocationEventsList;