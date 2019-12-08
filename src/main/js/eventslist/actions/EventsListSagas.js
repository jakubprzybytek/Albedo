import { select, takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { buildEventsListRequestParams } from '../api/EventsListRequestBuilder';
import { buildStoreEventsListAction } from './EventsListActions';

export const FETCH_EVENTS = 'FETCH_EVENTS';

export function buildFetchEventsSaga() {
  return { type: FETCH_EVENTS };
};

const fetch = (payload) => {
  return axios.get('/api/events', payload)
    .then(response => response)
    .catch(err => err);
}

export function* fetchEvents() {
  console.log('Fetch events');

  const params = yield select(store => buildEventsListRequestParams(store));

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

export function* watchFetchEvents() {
  yield takeLatest(FETCH_EVENTS, fetchEvents)
}