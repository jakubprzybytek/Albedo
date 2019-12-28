export const UPDATE_EVENTS_LIST_SETTINGS_SECTION = 'UPDATE_EVENTS_LIST_SETTINGS_SECTION';
export const STORE_EVENTS_LIST = 'STORE_EVENTS_LIST';

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
