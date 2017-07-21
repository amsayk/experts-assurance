import { PATH_SEARCH } from 'vars';

let Search;

export default (store) => ({
  path: PATH_SEARCH,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      if (Search) {
        /*  Return getComponent   */
        cb(null, Search);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/SearchContainer');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
      const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

      store.injectReducers([
        { key: 'docSearch', reducer: docSearchReducer },
        { key: 'toastr',    reducer: toastrReducer },
      ]);

      Search = UserIsAuthenticated(Component);

      /*  Return getComponent   */
      cb(null, Search);

      /* Webpack named bundle   */
    }, 'Search');
  },
});

