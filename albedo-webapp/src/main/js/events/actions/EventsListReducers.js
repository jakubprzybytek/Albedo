import update from 'immutability-helper';
import {
  UPDATE_EVENTS_LIST_SETTINGS_SECTION,
  STORE_EVENTS_LIST,
  STORE_FUTURE_EVENTS_LIST,
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
  }

  return state;
}
