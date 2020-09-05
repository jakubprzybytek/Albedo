import { UPDATE_TIME_ZONE } from './TimeZoneActions';
import { localStorageVariable } from '../../utils/LocalStorage';

const [initialState, updateState] = localStorageVariable('userSettings.time.timeZone', 'UTC+01:00');

export default function timeZoneReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TIME_ZONE:
      return updateState(action.timeZone);
  }

  return state;
}