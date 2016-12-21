import { PATH_LOGIN } from 'vars';
import { UserAuthWrapper } from 'redux-auth-wrapper';

export default UserAuthWrapper({
  authSelector           : state => state.get('user').toJS(),
  failureRedirectPath    : PATH_LOGIN,
});

