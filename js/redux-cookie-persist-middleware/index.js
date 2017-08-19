import cookie from 'react-cookie';

const YEARLY = 365 * 24 * 60 * 60;

export const middleware = params => store => next => action => {
  const result = next(action);

  if (action.type in params) {
    const keys = params[action.type];
    const value =
      typeof keys.reducerKey === 'function'
        ? keys.reducerKey(store.getState())
        : store.getState().getIn(keys.reducerKey.split('.'));

    cookie.save(keys.cookieKey, value, {
      path: params.path || '/',
      hostOnly: true,
      maxAge: params.maxAge || YEARLY,
    });
  }

  return result;
};
