// NOTE: File not in use. It was used before for refreshing token strategy. Now we use axios interceptors.

import { authService } from '../services';
import { authConstants } from '../constants';
import { authActions } from '../actions';

let buffer = [];

export const jwt = store => next => action => {
  buffer.push(action);
  if (action.type === authConstants.INVALID_TOKEN) {
    let theStore = store.getState();
    if (
      theStore.authentication &&
      theStore.authentication.user.authToken &&
      theStore.authentication.user.refreshToken
    ) {
      if (!theStore.authentication.pendingRefreshingToken) {
        store.dispatch({ type: authConstants.REFRESHING_TOKEN });

        authService
          .refreshToken(theStore.authentication.user.refreshToken)
          .then(() => {
            store.dispatch({ type: authConstants.TOKEN_REFRESHED });
            // get the action before the last PENDING_REFRESH_TOKEN (the one which got denied because of token expiration)
            let pos =
              buffer
                .map(e => e.type)
                .indexOf(authConstants.PENDING_REFRESH_TOKEN) - 1;

            // count back from the invalid token dispatch, and fire off the last dispatch again which was
            // a function. These are to be dispatched, and have the dispatch function passed through to them.
            for (var i = pos; i > -1; i--) {
              if (typeof buffer[i] === 'function') {
                store.dispatch({
                  type: authConstants.RESEND,
                  action: buffer[i](store.dispatch)
                });
              }
            }
            buffer = [];
          })
          .catch(error => {
            store.dispatch({
              type: authConstants.INVALID_REFRESH_TOKEN,
              error: error.error
            });
          });
      }
    }
  } else if (action.type === authConstants.INVALID_REFRESH_TOKEN) {
    buffer = [];
    store.dispatch(authActions.logout());
  } else {
    if (buffer.length > 20) {
      //remove all items but keep the last 20 which forms the buffer
      buffer.splice(0, buffer.length - 20);
    }
    return next(action);
  }
};
