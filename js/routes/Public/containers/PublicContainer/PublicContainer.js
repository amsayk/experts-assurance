import React from 'react';
import T from 'prop-types';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { withApollo } from 'react-apollo';

import { APP_NAME } from 'vars';

import style from 'routes/Public/styles';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import messages from 'routes/Public/messages';

export class PublicContainer extends React.PureComponent {
  render() {
    const { intl, user, className, actions } = this.props;
    return (
      <div className={style.root}>
        <div className={style.center}>
          <p>
            <h3>
              Bienvenue à <b>{APP_NAME}</b>
            </h3>
          </p>
        </div>
      </div>
    );
  }
}

PublicContainer.propTypes = {};

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({}, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, withApollo, Connect)(PublicContainer);
