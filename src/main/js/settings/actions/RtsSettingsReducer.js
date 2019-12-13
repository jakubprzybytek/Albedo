import { UPDATE_RTS_SETTINGD } from './RtsSettingsActions';

const initialState = {
  rtsEnabled: true,
  rtsSunEnabled: false,
  rtsMoonEnabled: true
}

export default function rtsSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_RTS_SETTINGD:
      return action.rtsSettings;
  }

  return state
}