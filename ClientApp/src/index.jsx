import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import * as ConfigureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { defaultInitialState } from './store/state';

/* eslint-disable no-undef */

// FontAwesome - import and add an icon to the Library
library.add(faHome);

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState || defaultInitialState;
const store = ConfigureStore.configureStore(initialState);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
