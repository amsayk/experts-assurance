import { store } from 'redux/store';

import Parse from 'parse';

import { logOut } from 'redux/reducers/user/actions';
import { post as addNotification } from 'redux/reducers/notification/actions';

import { INIT } from 'vars';

export default function refreshCurrentUser() {
  const currentUser = Parse.User.current();
  if (currentUser) {
    return currentUser
      .fetch({ sessionToken: currentUser.getSessionToken() })
      .then(() => store.dispatch({ type: INIT }))
      .catch(err => {
        switch (err.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            store.dispatch(logOut());
            store.dispatch(
              addNotification('SessionExpired', { duration: 9 * 1000 }),
            );
        }
      });
  }
}
