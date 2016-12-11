import Title from './Title';

import { isServer } from 'env';

import emptyFunction from 'emptyFunction';

export default isServer ? emptyFunction.thatReturns(null) : Title;

