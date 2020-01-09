import axiosInstance from '../axios';
import { history } from '../helpers';
import store from '../store';
import { authConstants } from '../constants';

export const authService = {
  register,
  login,
  logout,
  refreshToken
};

async function register(user) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: user
  };

  const response = await axiosInstance.post(
    `/api/auth/register`,
    requestOptions.body,
    requestOptions.headers
  );

  return handleResponse(response);
}

async function login(email, password) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json', skipAuthRefresh: true },
    body: { email, password }
  };

  try {
    const response = await axiosInstance.post(
      `/api/auth/login`,
      requestOptions.body,
      requestOptions.headers
    );

    const user = handleResponse(response);
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    handleResponse(error.response);
  }
}

async function logout(refreshToken) {
  if (!refreshToken) {
    localStorage.removeItem('user');

    history.push('/login');

    return;
  }

  try {
    const response = await axiosInstance.post('/api/auth/logout', {
      refreshToken
    });

    if (response.data.success) {
      // remove user from local storage to log user out
      localStorage.removeItem('user');

      return response.data.success;
    }
  } catch (error) {
    handleResponse(error.response);
  }
}

async function refreshToken() {
  store.dispatch({ type: authConstants.REFRESHING_TOKEN });

  try {
    const refreshToken = JSON.parse(localStorage.getItem('user')).refreshToken;

    const response = await axiosInstance.post('/api/auth/refreshToken', {
      refreshToken
    });

    if (response.data.success) {
      let user = JSON.parse(localStorage.getItem('user'));
      user.authToken = response.data.authToken;
      localStorage.setItem('user', JSON.stringify(user));

      store.dispatch({ type: authConstants.TOKEN_REFRESHED });
    }
  } catch (error) {
    handleResponse(error.response);
  }
}

function handleResponse(response) {
  const data = response.data;

  if (!response.data.success) {
    if (
      response.status === 401 &&
      data.message === 'Refresh token expired - session ended.'
    ) {
      // NOTE: Auto logout if refresh token expired returned
      logout(null);
    }

    const error = (data && data.message) || response.statusText;

    // eslint-disable-next-line no-throw-literal
    throw { error, code: data.status };
  }

  return data;
}
