import Public from 'routes/Public/containers/PublicContainer';

export default (store) => ({
  path: '/',
  getComponent(nextState, cb) {
    cb(null, Public);
  },
});

