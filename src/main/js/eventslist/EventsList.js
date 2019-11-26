import React from 'react';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { red, orange, yellow, grey } from '@material-ui/core/colors';
import axios from 'axios';
import { addDays, format } from 'date-fns';
import RiseTransitSetEventListItem from './RiseTransitSetEventListItem';
import ConjunctionEventListItem from './ConjunctionEventListItem';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 1000,
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
   backgroundColor: grey[200],
  },
}));

const mapStateToProps = state => {
  return {
    observerLocation: state.observerLocation,
    timeZone: state.timeZone
  };
};

function EventsList(props) {

  const { observerLocation, timeZone } = props;

  const [events, setEvents] = React.useState([]);

  const classes = useStyles();

  function handleRefresh() {

    //setLoading(true);
    var startTime = new Date();

    axios.get("/api/events", {
        params: {
          from: format(new Date(), "yyyy-MM-dd"),
          to: format(addDays(new Date(), 1), "yyyy-MM-dd"),
          ...observerLocation,
          timeZone: timeZone
        }
      })
      .then(res => {
        //setDuration(new Date() - startTime);
        //setLastCall(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        //setLinkUrl(res.request.responseURL);
        //setErrorMessage('');

        setEvents(groupByDay(res.data));

        //setLoading(false);
      },
      error => {
        //setLinkUrl(error.request.responseURL);
        //setErrorMessage(error.message);
        //setLoading(false);
      });
  }

  function groupByDay(flatEventsList) {
    return flatEventsList.reduce(function(eventsByDay, event) {
      let key = event.localTime.substr(0, 10);
      (eventsByDay[key] = eventsByDay[key] || []).push(event);
      return eventsByDay;
    }, {});
  }

  function EventDispatcher (props) {

    const { event } = props;

    return (
      <React.Fragment>
        {event.type === "RiseTransitSet" && <RiseTransitSetEventListItem event={event} />}
        {event.type === "Conjunction" && <ConjunctionEventListItem event={event} />}
      </React.Fragment>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleRefresh}>Refresh</Button>
      <List dense={true} className={classes.list} subheader={<li />}>
        {Object.keys(events).map(daySection => (
          <li key={daySection} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.subheader}>{daySection}</ListSubheader>
              {events[daySection].map(event => (
                <ListItem className={classes.listRow}>
                  <EventDispatcher event={event} />
                </ListItem>
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