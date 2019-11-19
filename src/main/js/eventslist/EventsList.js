import React from 'react';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { red, orange, yellow, grey } from '@material-ui/core/colors';
import axios from 'axios';
import { addDays, format } from 'date-fns';
import RiseTransitSetEventListItem from './RiseTransitSetEventListItem';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 800,
  },
   listSection: {
     backgroundColor: 'inherit',
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
    observerLocation: state.observerLocation
  };
};

function EventsList(props) {

  const { observerLocation } = props;

  const [events, setEvents] = React.useState([]);

  const classes = useStyles();

  function handleRefresh() {

    //setLoading(true);
    var startTime = new Date();

    axios.get("/api/events", {
        params: {
          ...observerLocation,
          from: format(new Date(), "yyyy-MM-dd"),
          to: format(addDays(new Date(), 1), "yyyy-MM-dd"),
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
      let key = format(Date.parse(event.time), "yyyy.MM.dd");
      (eventsByDay[key] = eventsByDay[key] || []).push(event);
      return eventsByDay;
    }, {});
  }

  return (
    <Paper className={classes.paper}>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleRefresh}>Refresh</Button>
      <List dense={true} className={classes.list} subheader={<li />}>
        {Object.keys(events).map(daySection => (
          <li className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.subheader}>{daySection}</ListSubheader>
              {events[daySection].map(event => (
                <RiseTransitSetEventListItem event={event} />
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