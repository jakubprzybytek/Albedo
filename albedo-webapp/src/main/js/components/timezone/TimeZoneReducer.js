import { UPDATE_TIME_ZONE} from './TimeZoneActions';

const initialState = "UTC+01:00"

export default function timeZoneReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TIME_ZONE:
      return action.timeZone;
  }

  return state
}