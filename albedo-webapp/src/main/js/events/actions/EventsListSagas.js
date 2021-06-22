import { select, takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { addDays, addMonths, format } from 'date-fns';

import { buildEventsListRequestParams } from './api/EventsListRequestBuilder';
import { buildStoreEventsListAction, buildStoreFutureEventsListAction } from './EventsListActions';
import { buildUpdateEventsListSettingsSectionAction } from './EventsListActions';

export const UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA = 'UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA';
export const FETCH_EVENTS = 'FETCH_EVENTS';
export const FETCH_FUTURE_EVENTS = 'FETCH_FUTURE_EVENTS';

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

export function buildFetchFutureEventsSaga() {
  return { type: FETCH_FUTURE_EVENTS };
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

  const params = yield select(store => buildEventsListRequestParams(
    format(new Date(), "yyyy-MM-dd"),
    format(addDays(new Date(), 2), "yyyy-MM-dd"),
    store.eventsList.settings.rts,
    store.eventsList.settings.conjunctions,
    store.eventsList.settings.eclipses,
    store.observerLocation,
    store.timeZone)
  );

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

export function* fetchFutureEvents() {
  console.log('Fetch future events');

  const switchDay = addDays(new Date(), 2);
  const params = yield select(store => buildEventsListRequestParams(
    format(switchDay, "yyyy-MM-dd"),
    format(addMonths(switchDay, 12), "yyyy-MM-dd"),
    { enabled: false },
    {
      enabled: true,
      planetsEnabled: true
    },
    { enabled: false },
    store.observerLocation,
    store.timeZone)
  );

  try {
    const response = yield call(fetch, {
      params: params
    });

    if (response) {
      yield put(buildStoreFutureEventsListAction(response.data));
    }
  } catch (err) {
    console.log(err);
  }
};

export function* watchEventsListSagas() {
  yield takeLatest(UPDATE_EVENTS_LIST_SETTINGS_SECTION_SAGA, updateEventsListSettingsSectionsSaga)
  yield takeLatest(FETCH_EVENTS, fetchEvents)
  yield takeLatest(FETCH_FUTURE_EVENTS, fetchFutureEvents)
};