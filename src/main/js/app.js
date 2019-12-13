import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'regenerator-runtime/runtime';
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects';
import Dashboard from './Dashboard';
import locationReducer from './components/observerlocation/LocationReducer';
import timeZoneReducer from './components/timezone/TimeZoneReducer';
import rtsSettingsReducer from './settings/actions/RtsSettingsReducer';
import storeEventsListReducer from './eventslist/actions/EventsListReducers';
import { watchFetchEvents, fetchEvents } from './eventslist/actions/EventsListSagas';
import { watchUpdateRtsSettingsSaga } from './settings/actions/RtsSettingsSagas';

const albedoReducer = combineReducers({
  observerLocation: locationReducer,
  timeZone: timeZoneReducer,
  rtsSettings: rtsSettingsReducer,
  eventsList: storeEventsListReducer,
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(albedoReducer, applyMiddleware(sagaMiddleware));

store.subscribe(() => console.log(store.getState()))

export default function* rootSaga() {
  yield all([
    watchFetchEvents(),
    watchUpdateRtsSettingsSaga(),
    fetchEvents()
  ])
}

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <Dashboard />
  </Provider>,
  document.getElementById('root')
);
