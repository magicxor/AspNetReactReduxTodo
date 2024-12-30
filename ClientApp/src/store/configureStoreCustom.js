import { applyMiddleware, combineReducers, compose } from 'redux';
import { configureStore } from '@reduxjs/ toolkit';
import { reducer as TaskListReducer } from '../features/taskList/reducer';
import createSagaMiddleware from 'redux-saga';
import { sagas } from '../sagas';

export function configureStoreCustom(initialState) {
  const rootReducer = combineReducers({
    taskList: TaskListReducer,
  });

  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (
    isDevelopment &&
    typeof window !== 'undefined' &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }

  const store = configureStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(sagaMiddleware), ...enhancers),
  );

  // then run the saga
  sagas.map((saga) => sagaMiddleware.run(saga));

  return store;
}
