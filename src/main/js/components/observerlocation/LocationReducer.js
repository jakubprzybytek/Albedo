import { UPDATE_OBSERVER_LOCATION } from './LocationActions';

const initialState = {
  longitude: -16.8745,
  latitude: 52.3944028,
  height: 70
}

export default function locationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_OBSERVER_LOCATION:
      return action.observerLocation;
  }

  return state
}