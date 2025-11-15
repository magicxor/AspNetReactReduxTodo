import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as TaskListReducer } from '../features/taskList/reducer';
import createSagaMiddleware from 'redux-saga';
import { sagas } from '../sagas';

export function configureStoreCustom(initialState) {
  const rootReducer = combineReducers({
    taskList: TaskListReducer,
  });

  const sagaMiddleware = createSagaMiddleware();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
    devTools: isDevelopment,
  });

  sagas.forEach((saga) => sagaMiddleware.run(saga));

  return store;
}
