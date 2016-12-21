import Title from './Title';

import { isServer } from 'vars';

import emptyFunction from 'emptyFunction';

export default isServer ? emptyFunction.thatReturns(null) : Title;

