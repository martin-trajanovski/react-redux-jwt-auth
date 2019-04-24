import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import { jwt } from './midleware';

const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(jwt, thunkMiddleware, loggerMiddleware)
);

export default store;
