export function authHeader() {
  // NOTE: return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.authToken) {
    return { Authorization: 'Bearer ' + user.authToken };
  } else {
    return {};
  }
}
