import { isServer } from 'vars';

export default isServer
  ? ({ children }) => children
  : require('./Zoom').default;

