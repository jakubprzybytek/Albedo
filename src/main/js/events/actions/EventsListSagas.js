import { select, takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { buildEventsListRequestParams } from '../api/EventsListRequestBuilder';
import { buildStoreEventsListAction } from './EventsListActions';
import { buildUpdateEventsListSettingsSectionAction } from './EventsListActions';

export const UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA = 'UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA';

export const FETCH_EVENTS = 'FETCH_EVENTS';

export function buildUpdateEventsListSettingsSectionsSaga(sectionName, settingsSection) {
  return {
    type: UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA,
    sectionName: sectionName,
    settingsSection: settingsSection
  };
};

export function buildFetchEventsSaga() {
  return { type: FETCH_EVENTS };
};

export function* updateEventsListSettingsSectionsSaga(action) {
  console.log("Update settings section saga");
  yield put(buildUpdateEventsListSettingsSectionAction(action.sectionName, action.settingsSection));
  yield put(buildFetchEventsSaga());
};

const fetch = (payload) => {
  return axios.get('/api/events', payload)
    .then(response => response)
    .catch(err => err);
}

export function* fetchEvents() {
  console.log('Fetch events');

  const params = yield select(store => buildEventsListRequestParams(store.eventsList.settings, store.observerLocation, store.timeZone));

  try {
    const response = yield call(fetch, {
      params: params
    });

    if (response) {
      yield put(buildStoreEventsListAction(response.data));
    }
  } catch (err) {
    console.log(err);
  }
};

export function* watchUpdateEventsListSettingsSectionsSaga() {
  yield takeLatest(UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA, updateEventsListSettingsSectionsSaga)
};

export function* watchFetchEvents() {
  yield takeLatest(FETCH_EVENTS, fetchEvents)
};
