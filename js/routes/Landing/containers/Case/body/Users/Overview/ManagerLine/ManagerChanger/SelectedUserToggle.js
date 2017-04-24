import React from 'react'
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { LinkExternalIcon } from 'components/icons/MaterialIcons';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

class SelectedUserToggle extends React.Component {
  constructor() {
    super();

    this.onOpen = this.onOpen.bind(this);
  }
  onOpen(e) {
    this.props.onOpen();
  }

  render() {
    const { doc, user } = this.props;

    return (
      <div style={{display: 'inline-flex'}}>
        {doc.deletion ? '—' : <Button onClick={this.onOpen} className={cx(style.selectedUserButton, style.togglePickUser, style.selectedManagerButton)} role='button'>
          <div className={style.text} style={{}}>
            {user
              ? user.displayName
              : 'Affecter le gestionnaire'}
            </div>
          </Button>}
          {user ? <div style={{ marginLeft: 5, color: '#eee', display: 'flex', alignItems: 'flex-end' }}>
            <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
              <LinkExternalIcon size={18}/>
            </Link>
          </div> : null}
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(null, mapDispatchToProps);

export default compose(
  Connect,
)(SelectedUserToggle);

