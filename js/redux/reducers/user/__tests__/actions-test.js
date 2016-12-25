import { login, logOut } from '../actions';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../constants';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const history = {
  push: jest.fn(),
};

const client = {
  resetStore: jest.fn(),
};

const middlewares = [thunk.withExtraArgument({history, client})];
const mockStore = configureStore(middlewares);

describe('user actions', () => {
  it('login', () => {
    const payload = {};
    const action = login(payload);

    expect(action.type).toBe(USER_LOGGED_IN);
    expect(action.payload).toBe(payload);

    expect(action).toMatchSnapshot();
  });

  it('logOut should reset store and redirect', async () => {
    const store = mockStore({});
    try {
      await store.dispatch(logOut());
    } catch (e) {}
    const actions = store.getActions();
    expect(actions[0].type).toBe(USER_LOGGED_OUT);
    expect(client.resetStore).toHaveBeenCalled();
    expect(history.push).toBeCalledWith('/');
  });
});

