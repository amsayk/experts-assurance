import React from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import { CloseIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

import ProfilePic from 'components/Profile/ProfilePic';

class SelectedUserToggle extends React.Component {
  constructor() {
    super();

    this.onClear = this.onClear.bind(this);
    this.onClearOpen = this.onClearOpen.bind(this);
  }
  onClear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
  }
  onClearOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
    this.props.onOpen();
  }
  render() {
    const { loading, user = {} } = this.props;

    return (
      <Button onClick={this.onClear} className={style.selectedUserButton} role='button'>
        <span style={{ marginRight: 5 }}>
          <ProfilePic size={18} user={user}/>
        </span>
        <div className={style.text} style={{ marginRight: 5 }}>
          {user.displayName}
        </div>
        <CloseIcon className={style.closeIcon} size={12}/>
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
  DataLoader.user,
)(SelectedUserToggle);

