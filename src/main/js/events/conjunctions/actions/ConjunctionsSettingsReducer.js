import { UPDATE_CONJUNCTIONS_SETTINGS } from './ConjunctionsSettingsActions';

const initialState = {
  enabled: true,
  sunEnabled: false,
  moonEnabled: true,
  planetsEnabled: true,
  cometsEnabled: true,
  asteroidsEnabled: true,
  cataloguesEnabled: true,
}

export default function conjunctionsSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONJUNCTIONS_SETTINGS:
      return action.conjunctionsSettings;
  }

  return state;
}