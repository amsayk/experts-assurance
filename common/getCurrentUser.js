const Parse = require(process.env.PARSE_MODULE_PATH);

export default function getCurrentUser() {
  return Parse.User.current();
}

