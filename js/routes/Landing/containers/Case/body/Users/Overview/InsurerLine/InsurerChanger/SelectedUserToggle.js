import React from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

import cx from 'classnames';

class SelectedUserToggle extends React.Component {
  constructor() {
    super();

    this.onOpen = this.onOpen.bind(this);
  }
  onOpen(e) {
    this.props.onOpen();
  }

  render() {
    const { user } = this.props;

    return (
      <Button onClick={this.onOpen} className={cx(style.selectedUserButton, style.togglePickUser, style.selectedInsurerButton)} role='button'>
        <div className={style.text} style={{}}>
          {user ? user.displayName : 'Non affecté'}
        </div>
      </Button>
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

