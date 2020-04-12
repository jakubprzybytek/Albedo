export const UPDATE_EVENTS_LIST_SETTINGS_SECTION = 'UPDATE_EVENTS_LIST_SETTINGS_SECTION';
export const STORE_EVENTS_LIST = 'STORE_EVENTS_LIST';
export const EVENTS_LIST_TOGGLE_DAY_SECTION = 'EVENTS_LIST_TOGGLE_DAY_SECTION';
export const EVENTS_LIST_TOGGLE_EVENT = 'EVENTS_LIST_TOGGLE_EVENT';
export const STORE_FUTURE_EVENTS_LIST = 'STORE_FUTURE_EVENTS_LIST';
export const FUTURE_EVENTS_LIST_TOGGLE_DAY_SECTION = 'FUTURE_EVENTS_LIST_TOGGLE_DAY_SECTION';
export const FUTURE_EVENTS_LIST_TOGGLE_EVENT = 'FUTURE_EVENTS_LIST_TOGGLE_EVENT';

export function buildUpdateEventsListSettingsSectionAction(sectionName, settingsSection) {
  return {
    type: UPDATE_EVENTS_LIST_SETTINGS_SECTION,
    sectionName: sectionName,
    settingsSection: settingsSection
  };
};

export function buildStoreEventsListAction(eventsList) {
  return { type: STORE_EVENTS_LIST, eventsList };
};

export function buildStoreFutureEventsListAction(eventsList) {
  return { type: STORE_FUTURE_EVENTS_LIST, eventsList };
};

export function buildEventsListToggleDaySectionAction(daySection) {
  return {
    type: EVENTS_LIST_TOGGLE_DAY_SECTION,
    daySection: daySection
  };
};

export function buildFutureEventsListToggleDaySectionAction(daySection) {
  return {
    type: FUTURE_EVENTS_LIST_TOGGLE_DAY_SECTION,
    daySection: daySection
  };
};

export function buildEventsListToggleEventAction(eventId) {
  return {
    type: EVENTS_LIST_TOGGLE_EVENT,
    eventId: eventId
  };
};

export function buildFutureEventsListToggleEventAction(eventId) {
  return {
    type: FUTURE_EVENTS_LIST_TOGGLE_EVENT,
    eventId: eventId
  };
};
