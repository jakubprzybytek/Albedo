import { put, takeLatest } from 'redux-saga/effects';
import { buildUpdateEventsListSettingsSectionAction } from '../../actions/EventsListActions';
import { buildUpdateConjunctionsSettingsAction } from './ConjunctionsSettingsActions';
import { buildFetchEventsSaga } from '../../actions/EventsListSagas';

export const UPDATE_CONJUNCTIONS_SETTINGS_SAGA = 'UPDATE_CONJUNCTIONS_SETTINGS_SAGA';

export function buildUpdateConjunctionsSettingsSaga(conjunctionsSettings) {
  return { type: UPDATE_CONJUNCTIONS_SETTINGS_SAGA, conjunctionsSettings };
};

export function* updateConjunctionsSettingsSaga(action) {
  console.log("Update conjunctions settings saga");
  yield put(buildUpdateConjunctionsSettingsAction(action.conjunctionsSettings));
  yield put(buildFetchEventsSaga());
};

export function* watchUpdateConjunctionsSettingsSaga() {
  yield takeLatest(UPDATE_CONJUNCTIONS_SETTINGS_SAGA, updateConjunctionsSettingsSaga)
}