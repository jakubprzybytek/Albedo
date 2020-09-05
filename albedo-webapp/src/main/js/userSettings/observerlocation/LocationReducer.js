import { UPDATE_OBSERVER_LOCATION } from './LocationActions';
import { localStorageVariable } from '../../utils/LocalStorage';

const [initialState, updateState] = localStorageVariable('userSettings.time.location', {
    longitude: -16.8745,
    latitude: 52.3944028,
    height: 70
  });

export default function locationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_OBSERVER_LOCATION:
      return updateState(action.observerLocation);
  }

  return state
}