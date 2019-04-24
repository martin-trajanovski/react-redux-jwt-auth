import { userService } from '../services';
import { userConstants } from '../constants';
import { userActions } from '../actions';

let buffer = [];

export const jwt = store => next => action => {
  buffer.push(action);
  if (action.type === userConstants.INVALID_TOKEN) {
    let theStore = store.getState();
    if (
      theStore.authentication &&
      theStore.authentication.user.authToken &&
      theStore.authentication.user.refreshToken
    ) {
      if (!theStore.authentication.pendingRefreshingToken) {
        store.dispatch({ type: userConstants.REFRESHING_TOKEN });

        userService
          .refreshToken(theStore.authentication.user.refreshToken)
          .then(() => {
            store.dispatch({ type: userConstants.TOKEN_REFRESHED });
            // get the action before the last PENDING_REFRESH_TOKEN (the one which got denied because of token expiration)
            let pos =
              buffer
                .map(e => e.type)
                .indexOf(userConstants.PENDING_REFRESH_TOKEN) - 1;

            // count back from the invalid token dispatch, and fire off the last dispatch again which was
            // a function. These are to be dispatched, and have the dispatch function passed through to them.
            for (var i = pos; i > -1; i--) {
              if (typeof buffer[i] === 'function') {
                store.dispatch({
                  type: userConstants.RESEND,
                  action: buffer[i](store.dispatch)
                });
              }
            }
            buffer = [];
          })
          .catch(error => {
            store.dispatch({
              type: userConstants.INVALID_REFRESH_TOKEN,
              error: error.error
            });
          });
      }
    }
  } else if (action.type === userConstants.INVALID_REFRESH_TOKEN) {
    buffer = [];
    store.dispatch(userActions.logout());
  } else {
    if (buffer.length > 20) {
      //remove all items but keep the last 20 which forms the buffer
      buffer.splice(0, buffer.length - 20);
    }
    return next(action);
  }
};
