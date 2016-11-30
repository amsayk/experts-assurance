import cookie from 'react-cookie';

export const middleware = (params) => (store) => (next) => (action) => {
  const result = next(action);

  if (action.type in params) {
    const keys    = params[action.type];
    const value   = store.getState().getIn(keys.reducerKey.split('.'));
    const year    = 365 * 24 * 60 * 60;

    cookie.save(keys.cookieKey, value, {
      hostOnly: true,
      maxAge: year,
    });
  }

  return result;
};
