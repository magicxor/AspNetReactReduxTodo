import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';
import * as ConfigureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { defaultInitialState } from './store/state';

const store = ConfigureStore.configureStore(defaultInitialState);

const renderApp = () => render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

test('renders without crashing', async () => {
  renderApp();
});

test('renders ReactReduxTodo', async () => {
  const { getAllByText } = renderApp();
  const elementsToBeFound = getAllByText(/ReactReduxTodo/);
  const elementToBeFound = elementsToBeFound.find(e => e);
  expect(elementToBeFound).toBeInTheDocument();
});
