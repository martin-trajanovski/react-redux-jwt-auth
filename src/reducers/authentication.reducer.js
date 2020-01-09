import { authConstants } from '../constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? {
      loggedIn: true,
      user,
      error: '',
      pendingRefreshingToken: null,
      tokenIsValid: null
    }
  : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.user
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        error: '',
        loggedIn: true,
        loggingIn: false,
        user: action.user
      };
    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        error: action.error.error,
        loggingIn: false,
        loggedIn: false,
        loggingOut: false
      };
    case authConstants.CLEAR_AUTH_ERRORS:
      return {
        ...state,
        error: ''
      };
    case authConstants.LOGOUT_REQUEST:
      return {
        ...state,
        loggingOut: true
      };
    case authConstants.LOGOUT:
      return {
        ...state,
        loggedIn: false,
        loggingOut: false
      };
    case authConstants.REFRESHING_TOKEN:
      return {
        ...state,
        pendingRefreshingToken: true,
        tokenIsValid: false
      };
    case authConstants.TOKEN_REFRESHED:
      return {
        ...state,
        pendingRefreshingToken: null,
        tokenIsValid: true
      };
    default:
      return state;
  }
}
