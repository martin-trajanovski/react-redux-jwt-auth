import { authConstants } from '../constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case authConstants.REGISTER_REQUEST:
      return {
        ...state,
        registering: true,
        registered: false
      };
    case authConstants.REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        registered: true
      };
    case authConstants.REGISTER_FAILURE:
      return {
        ...state,
        registering: false,
        registered: false
      };
    default:
      return state;
  }
}
