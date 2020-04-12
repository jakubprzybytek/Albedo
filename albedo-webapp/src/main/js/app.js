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
import { eventsListReducer } from './events/actions/EventsListReducers';
import { watchEventsListSagas, fetchEvents, fetchFutureEvents } from './events/actions/EventsListSagas';

const albedoReducer = combineReducers({
  observerLocation: locationReducer,
  timeZone: timeZoneReducer,
  eventsList: eventsListReducer,
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(albedoReducer, applyMiddleware(sagaMiddleware));

store.subscribe(() => console.log(store.getState()))

export default function* rootSaga() {
  yield all([
    watchEventsListSagas(),
    fetchEvents(),
    fetchFutureEvents()
  ])
}

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <Dashboard />
  </Provider>,
  document.getElementById('root')
);
