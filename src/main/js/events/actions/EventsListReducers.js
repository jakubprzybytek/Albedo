import { UPDATE_EVENTS_LIST_SETTINGS_SECTION, STORE_EVENTS_LIST } from './EventsListActions';

const settingsInitialState = {
  rts: {
    rtsEnabled: true,
    rtsSunEnabled: false,
    rtsMoonEnabled: true
  },
  conjunctions: {
    enabled: true,
    sunEnabled: false,
    moonEnabled: true,
    planetsEnabled: true,
    cometsEnabled: true,
    asteroidsEnabled: true,
    cataloguesEnabled: true,
  }
}

const eventsListInitialState = [];

export function eventsListSettingsReducer(state = settingsInitialState, action) {
  switch (action.type) {
    case UPDATE_EVENTS_LIST_SETTINGS_SECTION:
      return { ...state, [action.sectionName]: action.settingsSection };
  }

  return state;
}

export function storeEventsListReducer(state = eventsListInitialState, action) {
  switch (action.type) {
    case STORE_EVENTS_LIST:
      return action.eventsList;
  }

  return state
}