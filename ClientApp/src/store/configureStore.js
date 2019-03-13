import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import * as TaskList from '../features/taskList/reducer';
import { sagas } from '../sagas';

export function configureStore(history, initialState) {
    const reducers = {
        taskList: TaskList.reducer
    };

    const sagaMiddleware = createSagaMiddleware();

    const middleware = [
        sagaMiddleware,
        routerMiddleware(history)
    ];

    // In development, use the browser's Redux dev tools extension if installed
    const enhancers = [];
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
        enhancers.push(window.devToolsExtension());
    }

    const rootReducer = combineReducers({
        router: connectRouter(history),
        ...reducers
    });

    const store = createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );

    sagas.map(saga => sagaMiddleware.run(saga));

    return store;
}
