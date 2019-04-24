import { userConstants } from '../constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? {
      loggedIn: true,
      user,
      pendingRefreshingToken: null,
      tokenIsValid: null
    }
  : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        loggingOut: false
      };
    case userConstants.LOGOUT_REQUEST:
      return {
        ...state,
        loggingOut: true
      };
    case userConstants.LOGOUT:
      return {
        ...state,
        loggedIn: false,
        loggingOut: false
      };
    case userConstants.REFRESHING_TOKEN:
      return {
        ...state,
        pendingRefreshingToken: true,
        tokenIsValid: false
      };
    case userConstants.TOKEN_REFRESHED:
      return {
        ...state,
        pendingRefreshingToken: null,
        tokenIsValid: true
      };
    default:
      return state;
  }
}
