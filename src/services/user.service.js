import axiosInstance from '../axios';

export const userService = {
  login,
  logout,
  register,
  refreshToken,
  getAll,
  getById,
  update,
  delete: _delete
};

function login(email, password) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: { email, password }
  };

  return axiosInstance
    .post(`/api/auth/login`, requestOptions.body, requestOptions.headers)
    .then(handleResponse)
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    });
}

function logout(refreshToken) {
  axiosInstance
    .post('/api/auth/logout', { refreshToken })
    .then(response => {
      if (response.data.success) {
        // remove user from local storage to log user out
        localStorage.removeItem('user');

        return response.data.success;
      }
    })
    .catch(error => {
      handleResponse(error.response);
    });
}

function refreshToken(refreshToken) {
  return axiosInstance
    .post('/api/auth/refreshToken', { refreshToken })
    .then(response => {
      if (response.data.success) {
        let user = JSON.parse(localStorage.getItem('user'));
        user.authToken = response.data.authToken;
        localStorage.setItem('user', JSON.stringify(user));

        return response.data.authToken;
      }
    })
    .catch(error => {
      handleResponse(error.response);
    });
}

function getAll() {
  return axiosInstance
    .get(`/api/users`)
    .then(handleResponse)
    .then(data => {
      return data.users;
    })
    .catch(error => {
      handleResponse(error.response);
    });
}

function getById(id) {
  return axiosInstance.get(`/users/${id}`).then(handleResponse);
}

function register(user) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: user
  };

  return axiosInstance
    .post(`/api/auth/signup`, requestOptions.body, requestOptions.headers)
    .then(handleResponse);
}

function update(user) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return axiosInstance
    .put(`/users/${user.id}`, requestOptions)
    .then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return axiosInstance.delete(`/users/${id}`).then(handleResponse);
}

function handleResponse(response) {
  const data = response.data;
  if (!response.data.success) {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      logout();
      window.location.reload(true);
    }

    const error = (data && data.message) || response.statusText;

    // eslint-disable-next-line no-throw-literal
    throw { error, code: data.code };
  }

  return data;
}
