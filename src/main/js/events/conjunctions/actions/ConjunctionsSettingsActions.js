export const UPDATE_CONJUNCTIONS_SETTINGS = 'UPDATE_CONJUNCTIONS_SETTINGS';

export function buildUpdateConjunctionsSettingsAction(conjunctionsSettings) {
  return { type: UPDATE_CONJUNCTIONS_SETTINGS, conjunctionsSettings };
};
