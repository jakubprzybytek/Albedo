import { STORE_EVENTS_LIST } from './EventsListActions';

const initialState = [];

export default function storeEventsListReducer(state = initialState, action) {
  switch (action.type) {
    case STORE_EVENTS_LIST:
      return action.eventsList;
  }

  return state
}