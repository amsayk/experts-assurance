jest.mock('common/getCurrentUser');

import { login } from '../actions';
import { USER_LOGGED_OUT } from '../constants';
import reducer from '../reducer';

import { fromJS } from 'immutable';

import { INIT } from 'vars';

import getCurrentUser from 'getCurrentUser';

const randomActionType = '@@UNKNOWN_ACTION';

describe('user reducer', () => {
  it('should return initialState on unhandled action', () => {
    expect(reducer(undefined, { type: randomActionType }))
      .toEqual(fromJS({}));

    expect(reducer(undefined, { type: randomActionType }))
      .toMatchSnapshot();
  });

  it('should mentain its state on unhandled action', () => {
    expect(reducer(fromJS({ id: 'myId' }), { type: randomActionType }))
      .toEqual(fromJS({
        id: 'myId',
      }));

    expect(reducer(fromJS({ id: 'myId' }), { type: randomActionType }))
      .toMatchSnapshot();
  });

  it('should handle `INIT`', () => {
    getCurrentUser._setCurrentUser({ id: '1' });
    expect(reducer(undefined, { type: INIT }))
      .toEqual(fromJS({
        id: '1',
      }));

    expect(reducer(undefined, { type: INIT }))
      .toMatchSnapshot();

    getCurrentUser._setCurrentUser(null);
    expect(reducer(undefined, { type: INIT }))
      .toEqual(fromJS({}));

    expect(reducer(undefined, { type: INIT }))
      .toMatchSnapshot();
  });

  it('should handle login', () => {
    const user = { id: 'myLoginId' };
    expect(reducer(undefined, login(user)))
      .toEqual(fromJS(user));

    expect(reducer(undefined, login(user)))
      .toMatchSnapshot();
  });

  it('should handle logOut', () => {
    expect(reducer(undefined, { type: USER_LOGGED_OUT }))
      .toEqual(fromJS({}));

    expect(reducer(undefined, { type: USER_LOGGED_OUT }))
      .toMatchSnapshot();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});

