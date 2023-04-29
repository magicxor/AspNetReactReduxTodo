import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';
import * as ConfigureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { defaultInitialState } from './store/state';

const store = ConfigureStore.configureStore(defaultInitialState);

test('renders without crashing', () => {
  render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  );
});
