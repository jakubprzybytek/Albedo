import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore  } from 'redux'
import { Provider } from 'react-redux'
import Dashboard from './Dashboard';
import locationReducer from './components/observerlocation/LocationReducer';
import timeZoneReducer from './components/timezone/TimeZoneReducer';

const albedoApp = combineReducers({
  observerLocation: locationReducer,
  timeZone: timeZoneReducer
})

const store = createStore(albedoApp);

store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <Dashboard />
  </Provider>,
  document.getElementById('root')
);
