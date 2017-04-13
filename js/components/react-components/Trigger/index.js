import { SERVER } from 'vars';

export default SERVER
  ? ({ children }) => children
  : require('./Trigger').default;

