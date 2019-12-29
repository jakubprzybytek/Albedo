import { UPDATE_EVENTS_LIST_SETTINGS_SECTION, STORE_EVENTS_LIST } from './EventsListActions';

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

export function eventsListReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_EVENTS_LIST_SETTINGS_SECTION:
      return { ...state, settings: { ...state.settings, [action.sectionName]: action.settingsSection } };
    case STORE_EVENTS_LIST:
      return { ...state, events: action.eventsList };
  }

  return state;
}
