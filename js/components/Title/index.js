import Title from './Title';

import { isServer } from 'environment';

import emptyFunction from 'emptyFunction';

export default isServer ? emptyFunction.thatReturns(null) : Title;

