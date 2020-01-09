import { authService } from '../services';
import { authConstants } from '../constants';
import { history } from '../helpers';

export const authActions = {
  login,
  logout,
  register,
  clearErrors
};

function clearErrors() {
  return dispatch => {
    dispatch({ type: authConstants.CLEAR_AUTH_ERRORS });
  };
}

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }));

    authService.login(username, password).then(
      user => {
        dispatch(success(user));
        history.push('/');
      },
      error => {
        dispatch(failure(error));
        // dispatch(alertActions.error(error));
      }
    );
  };

  function request(user) {
    return { type: authConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: authConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: authConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  return async (dispatch, getState) => {
    const { user, loggingOut } = getState().authentication;

    if (!loggingOut) {
      if (user && user.refreshToken) {
        try {
          dispatch({ type: authConstants.LOGOUT_REQUEST });
          await authService.logout(user.refreshToken);
          history.push('/login');

          return { type: authConstants.LOGOUT };
        } catch (error) {
          return { type: authConstants.LOGOUT_FAILURE };
        }
      } else {
        history.push('/login');
        return { type: authConstants.LOGOUT };
      }
    }
  };
}

function register(user) {
  return dispatch => {
    dispatch(request(user));

    authService.register(user).then(
      () => {
        dispatch(success());
        history.push('/login');
        // dispatch(alertActions.success('Registration successful'));
      },
      error => {
        dispatch(failure(error));
        // dispatch(alertActions.error(error));
      }
    );
  };

  function request(user) {
    return { type: authConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: authConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: authConstants.REGISTER_FAILURE, error };
  }
}
