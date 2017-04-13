import { store } from 'redux/store';

import Parse from 'parse';

import { BusinessType } from 'data/types';

import { logOut } from 'redux/reducers/user/actions';
import {
  post as addNotification,
  remove as removeNotification,
} from 'redux/reducers/notification/actions';

import {
  BUSINESS_KEY,
} from 'vars';

export default async function checkBusiness() {
  const user = store.getState().get('user');

  if (user && !user.isEmpty) {
    const business = await new Parse.Query(BusinessType)
      .equalTo('key', BUSINESS_KEY)
      .first({ sessionToken: user.sessionToken });
    if (user.emailVerified) {
      business
        && business.has('displayName')
        && business.get('displayName')
        && store.dispatch(addNotification('BusinessRequired', { persist: true }));
    } else {
      store.dispatch(removeNotification('BusinessRequired'));
    }
  }
}

