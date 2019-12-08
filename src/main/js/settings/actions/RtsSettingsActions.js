export const UPDATE_RTS_SETTINGD = 'UPDATE_RTS_SETTINGD';

export function buildUpdateRtsSettingsAction(rtsSettings) {
  return { type: UPDATE_RTS_SETTINGD, rtsSettings };
};
