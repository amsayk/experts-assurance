import React, { PropTypes as T } from 'react'

import { compose } from 'redux';
import { connect } from 'react-redux';

import emptyObject from 'emptyObject';

import { injectIntl } from 'react-intl';

import DataLoader from 'routes/Landing/DataLoader';

import selector from './selector';

import cx from 'classnames';

import style from 'routes/Landing/styles';

import Nav from 'routes/Landing/components/Nav';

// import FileEntry from './FileEntry';
// import NewFileEntry from './NewFileEntry';

const NAVBAR_HEIGHT = 70;
const TOOLBAR_HEIGHT = 41;

const TOP = NAVBAR_HEIGHT + TOOLBAR_HEIGHT + 20;

const NOTIFICATION_HEIGHT = 45;

const styles = {
  notificationOpen : {
    top : TOP + NOTIFICATION_HEIGHT,
  },
};

class Observations extends React.PureComponent {
  static defaultProps = {
    loading : false,
    observations  : [],
  };

  constructor(props) {
    super(props);


    this.state = {
    };
  }


  componentWillReceiveProps(nextProps) {

  }
  render() {
    const {
      intl,
      id,
      notificationOpen,
      loading,
      cursor,
      observations : items,
    } = this.props;

    // if (loading) {
    //   return null;
    // }

    return (
      <div className={style.timeline} style={notificationOpen ? styles.notificationOpen : emptyObject}>
        <Nav
          intl={intl}
          onChange={this.props.onNav}
          selectedNavItem='timeline.comments'
        />
        <div className={style.feed}>
          TODO
        </div>
      </div>
    );
  }

}

Observations.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.docObserations,
)(Observations);

