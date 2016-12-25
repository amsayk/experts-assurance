let _current_user = null;

export default function getCurrentUser() {
  return _current_user;
}

getCurrentUser._setCurrentUser = function (user) {
  _current_user = user;
};

