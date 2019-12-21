import { put, takeLatest } from 'redux-saga/effects';
import { buildUpdateRtsSettingsAction } from './RtsSettingsActions';
import { buildFetchEventsSaga } from '../../actions/EventsListSagas';

export const UPDATE_RTS_SETTINGS_SAGA = 'UPDATE_RTS_SETTINGS_SAGA';

export function buildUpdateRtsSettingsSaga(rtsSettings) {
  return { type: UPDATE_RTS_SETTINGS_SAGA, rtsSettings };
};

export function* updateRtsSettingsSaga(action) {
  console.log("Update rts settings saga");
  yield put(buildUpdateRtsSettingsAction(action.rtsSettings));
  yield put(buildFetchEventsSaga());
};

export function* watchUpdateRtsSettingsSaga() {
  yield takeLatest(UPDATE_RTS_SETTINGS_SAGA, updateRtsSettingsSaga)
}