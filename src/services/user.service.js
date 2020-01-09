import axiosInstance from '../axios';

export const userService = {
  getAll,
  getById,
  update,
  delete: _delete
};

function getAll() {
  return axiosInstance
    .get(`/api/users`)
    .then(handleResponse)
    .then(data => {
      return data.users;
    })
    .catch(error => {
      if (error && error.response) {
        handleResponse(error.response);
      } else {
        throw error;
      }
    });
}

function getById(id) {
  return axiosInstance.get(`/users/${id}`).then(handleResponse);
}

function update(user) {
  return axiosInstance.put(`/users/${user.id}`, user).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return axiosInstance.delete(`/users/${id}`).then(handleResponse);
}

function handleResponse(response) {
  const data = response.data;

  if (!response.data.success) {
    const error = (data && data.message) || response.statusText;

    // eslint-disable-next-line no-throw-literal
    throw { error, code: data.data.code };
  }

  return data;
}
