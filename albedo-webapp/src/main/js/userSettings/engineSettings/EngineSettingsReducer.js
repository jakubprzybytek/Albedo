import { UPDATE_ENGINE_SETTINGS } from './EngineSettingsActions';
import { localStorageVariable } from '../../utils/LocalStorage';

const [initialState, updateState] = localStorageVariable('userSettings.engineSettings', {
  ephemerisMethodPreference: ''
});

export default function engineSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ENGINE_SETTINGS:
      return updateState(action.engineSettings);
  }

  return state;
}