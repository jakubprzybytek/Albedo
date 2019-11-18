import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Dashboard from './Dashboard';
import locationReducer from './components/observerlocation/LocationReducer';

const store = createStore(locationReducer);

store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <Dashboard />
  </Provider>,
  document.getElementById('root')
);
