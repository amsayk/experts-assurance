import Parse from 'parse/node';

import {

} from 'backend/constants';

export class Activities {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  get(id) {
    return this.connector.get(id);
  }

  getTimeline(cursor, query) {
    return this.connector.getTimeline(cursor, query, this.user);
  }

}

