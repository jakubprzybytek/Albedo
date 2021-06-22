import update from 'immutability-helper';
import {
  UPDATE_EVENTS_LIST_SETTINGS_SECTION,
  STORE_EVENTS_LIST,
  EVENTS_LIST_TOGGLE_DAY_SECTION,
  EVENTS_LIST_TOGGLE_EVENT,
  STORE_FUTURE_EVENTS_LIST,
  FUTURE_EVENTS_LIST_TOGGLE_DAY_SECTION,
  FUTURE_EVENTS_LIST_TOGGLE_EVENT
} from './EventsListActions';

const initialState = {
  settings: {
    rts: {
      enabled: true,
      sunEnabled: false,
      moonEnabled: true
    },
    conjunctions: {
      enabled: true,
      sunEnabled: true,
      moonEnabled: true,
      planetsEnabled: true,
      cometsEnabled: true,
      asteroidsEnabled: true,
      cataloguesDSEnabled: true,
      filterBlindedBySun: true,
    },
    eclipses: {
      enabled: true
    }
  },
  events: [],
  eventProps: [],
  futureEventProps: []
}

function groupByDay(flatEventsList) {
  return flatEventsList.reduce((eventsByDay, event) => {
    let key = event.localTime.substr(0, 10);
    (eventsByDay[key] = eventsByDay[key] || { expanded: true, events: [] }).events.push(event);
    return eventsByDay;
  }, {});
}

function initEventProps(flatEventsList) {
  return flatEventsList.reduce((eventProps, event) => {
    eventProps[event.id] = { expanded: false };
    return eventProps;
  }, {});
}

export function eventsListReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_EVENTS_LIST_SETTINGS_SECTION:
      return {
        ...state,
        settings: { ...state.settings, [action.sectionName]: action.settingsSection }
      };
    case STORE_EVENTS_LIST:
      return {
        ...state,
        events: groupByDay(action.eventsList),
        eventProps: initEventProps(action.eventsList)
      };
    case STORE_FUTURE_EVENTS_LIST:
      return {
        ...state,
        futureEvents: groupByDay(action.eventsList),
        futureEventProps: initEventProps(action.eventsList)
      };
    case EVENTS_LIST_TOGGLE_DAY_SECTION:
      return update(state, {
        events: {
          [action.daySection]: {
            expanded: { $set: !state.events[action.daySection].expanded }
          }
        }
      });
    case FUTURE_EVENTS_LIST_TOGGLE_DAY_SECTION:
      return update(state, {
        futureEvents: {
          [action.daySection]: {
            expanded: { $set: !state.futureEvents[action.daySection].expanded }
          }
        }
      });
    case EVENTS_LIST_TOGGLE_EVENT:
      return update(state, {
        eventProps: {
          [action.eventId]: {
            expanded: { $set: !state.eventProps[action.eventId].expanded }
          }
        }
      });
    case FUTURE_EVENTS_LIST_TOGGLE_EVENT:
      return update(state, {
        futureEventProps: {
          [action.eventId]: {
            expanded: { $set: !state.futureEventProps[action.eventId].expanded }
          }
        }
      });
  }

  return state;
}
