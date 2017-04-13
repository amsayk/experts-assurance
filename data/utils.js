import Parse from 'parse/node';

import config from 'build/config';

import { BusinessType } from 'data/types';

export const businessQuery = () => new Parse.Query(BusinessType).equalTo('key', config.businessKey);

