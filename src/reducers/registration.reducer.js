import { userConstants } from '../constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return {
        ...state,
        registering: true,
        registered: false
      };
    case userConstants.REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        registered: true
      };
    case userConstants.REGISTER_FAILURE:
      return {
        ...state,
        registering: false,
        registered: false
      };
    default:
      return state;
  }
}
