import update from 'immutability-helper';
import { UPDATE_EVENTS_LIST_SETTINGS_SECTION, STORE_EVENTS_LIST, EVENTS_LIST_TOGGLE_DAY_SECTION } from './EventsListActions';

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
    }
  },
  events: []
}

function groupByDay(flatEventsList) {
  return flatEventsList.reduce((eventsByDay, event) => {
    let key = event.localTime.substr(0, 10);
    (eventsByDay[key] = eventsByDay[key] || { expanded: true, events: [] }).events.push(event);
    return eventsByDay;
  }, {});
}

export function eventsListReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_EVENTS_LIST_SETTINGS_SECTION:
      return { ...state, settings: { ...state.settings, [action.sectionName]: action.settingsSection } };
    case STORE_EVENTS_LIST:
      return { ...state, events: groupByDay(action.eventsList) };
    case EVENTS_LIST_TOGGLE_DAY_SECTION:
      return update(state, {
        events: {
          [action.daySection]: {
            expanded: { $set: !state.events[action.daySection].expanded }
          }
        }
      });
  }

  return state;
}
