import Parse from 'parse/node';

import {} from 'backend/constants';

export class Activities {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  get(id, cached = true) {
    return this.connector.get(id, cached);
  }

  getTimeline({ cursor, query }) {
    return this.connector.getTimeline({ cursor, query, user: this.user });
  }
}
