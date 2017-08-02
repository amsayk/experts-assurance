import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import arrayFindIndex from 'array-find-index';

import { getFormValues, change } from 'redux-form/immutable';

import { createSelector } from 'utils/reselect';

import Highlighter from 'react-highlight-words';

import DataLoader from 'routes/Landing/DataLoader';

import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Landing/styles';

class MatchingUsers extends React.Component {
  static contextTypes = {
    store: T.object.isRequired,
  };

  static defaultProps = {
    loading: false,
    users: [],
  };

  constructor() {
    super();

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(id) {
    const { type, users } = this.props;
    const index = arrayFindIndex(users, s => s.id === id);

    if (index === -1) {
      throw new Error(`onSelect: user ${id} doesn't exit`);
    }

    const user = users[index];
    let retn;

    if (type === 'CLIENT') {
      retn = {
        clientId: user.id,
        clientKey: 'id',
        clientDisplayName: user.displayName,
        clientEmail: user.email,
      };
    } else if (type === 'AGENT') {
      retn = {
        agentId: user.id,
        agentKey: 'id',
        agentDisplayName: user.displayName,
        agentEmail: user.email,
      };
    } else {
      throw new Error('Invalid type in MatchingClients.onSelect');
    }

    this.context.store.dispatch(
      Object.keys(retn).map(key =>
        change(
          'addDoc',
          key,
          retn[key],
          /* touch = */ key in
            [
              'clientDisplayName',
              'agentDisplayName',
              'clientEmail',
              'agentEmail',
            ],
        ),
      ),
    );
  }

  render() {
    const { loading, displayName: q, meta: { error }, users } = this.props;

    if (users.length === 0) {
      return null;
    }

    return (
      <div className={style.addDocFormMatchingUsersContainer}>
        <h6 className={style.addDocFormMatchingUsersHeading}>
          Voulez-vous dire
        </h6>
        <ul className={style.addDocFormMatchingUsersItems}>
          {users.map(s =>
            <MenuItem
              key={s.id}
              eventKey={s.id}
              onSelect={this.onSelect}
              className={style.addDocFormMatchingUsersItem}
            >
              <span>
                <Highlighter
                  highlightClassName={style.hit}
                  searchWords={[q]}
                  textToHighlight={s.displayName}
                />
              </span>
            </MenuItem>,
          )}
        </ul>
      </div>
    );
  }
}

const propsSelector = (state, { type }) => {
  const values = getFormValues('addDoc')(state);

  if (values) {
    if (type === 'CLIENT') {
      const key = values.get('clientKey');
      return {
        displayName: values ? values.get('clientDisplayName') : '',
        email: values ? values.get('clientEmail') : '',
        userKey: key,
      };
    } else if (type === 'AGENT') {
      const key = values.get('agentKey');
      return {
        displayName: values ? values.get('agentDisplayName') : '',
        email: values ? values.get('agentEmail') : '',
        userKey: key,
      };
    } else {
      throw new Error('Invalid type in propsSelector');
    }
  }
  return {};
};

const selector = createSelector(propsSelector, props => ({ ...props }));

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(Connect, DataLoader.searchMatchingUsers)(MatchingUsers);
