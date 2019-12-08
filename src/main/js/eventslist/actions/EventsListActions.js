export const STORE_EVENTS_LIST = 'STORE_EVENTS_LIST';

export function buildStoreEventsListAction(eventsList) {
  return { type: STORE_EVENTS_LIST, eventsList };
};