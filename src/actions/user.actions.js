import { userConstants } from '../constants';
import { userService } from '../services';
// import { alertActions } from './';
import { history } from '../helpers';

export const userActions = {
  login,
  logout,
  register,
  getAll,
  delete: _delete
};

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }));

    userService.login(username, password).then(
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
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  return async (dispatch, getState) => {
    const { user, loggingOut } = getState().authentication;

    if (!loggingOut) {
      if (user && user.refreshToken) {
        try {
          dispatch({ type: userConstants.LOGOUT_REQUEST });
          await userService.logout(user.refreshToken);
          history.push('/login');

          return { type: userConstants.LOGOUT };
        } catch (error) {
          return { type: userConstants.LOGOUT_FAILURE };
        }
      } else {
        history.push('/login');
        return { type: userConstants.LOGOUT };
      }
    }
  };
}

function register(user) {
  return dispatch => {
    dispatch(request(user));

    userService.register(user).then(
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
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function getAll() {
  return (dispatch, getState) => {
    dispatch(request());
    // console.log('aaa state', getState());

    userService
      .getAll()
      .then(
        users => dispatch(success(users)),
        error =>
          dispatch(
            failure(error, getState().authentication.pendingRefreshingToken)
          )
      );
  };

  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users };
  }
  function failure(error, pendingRefreshToken) {
    if (error.code === 'invalidToken') {
      if (pendingRefreshToken) {
        return {
          type: userConstants.PENDING_REFRESH_TOKEN,
          error: error.error
        };
      } else {
        return { type: userConstants.INVALID_TOKEN, error: error.error };
      }
    } else {
      return { type: userConstants.GETALL_FAILURE, error: error.error };
    }
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id));

    userService.delete(id).then(
      () => {
        dispatch(success(id));
      },
      error => {
        dispatch(failure(id, error));
      }
    );
  };

  function request(id) {
    return { type: userConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: userConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: userConstants.DELETE_FAILURE, id, error };
  }
}
