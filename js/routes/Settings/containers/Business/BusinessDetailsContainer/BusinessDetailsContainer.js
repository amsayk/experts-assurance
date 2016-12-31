import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import selector from './selector';

import style from '../../../Settings.scss';

import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

import messages from '../../../messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import QUERY from './currentBusiness.query.graphql';

import BusinessDetailsForm from './BusinessDetailsForm';

function BusinessDetailsContainer({ intl, user, data: { loading, currentBusiness }, actions }) {
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })}/>
      <Header onLogOut={actions.logOut}/>
      <div className={style.body}>
        <Sidebar selectedMenuItem={'business.settings'}/>
        {loading ? null : <BusinessDetailsForm user={user} intl={intl} initialValues={{
          displayName   : currentBusiness ? currentBusiness.displayName   : null,
          description   : currentBusiness ? currentBusiness.description   : null,
          addressLine1  : currentBusiness ? currentBusiness.addressLine1  : null,
          addressLine2  : currentBusiness ? currentBusiness.addressLine2  : null,
          city          : currentBusiness ? currentBusiness.city          : null,
          stateProvince : currentBusiness ? currentBusiness.stateProvince : null,
          postalCode    : currentBusiness ? currentBusiness.postalCode    : null,
          phone         : currentBusiness ? currentBusiness.phone         : null,
          taxId         : currentBusiness ? currentBusiness.taxId         : null,
        }}/>}
    </div>
  </div>
  );
}

BusinessDetailsContainer.propTypes = {
  intl: intlShape.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ logOut }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const withCurrentBusiness = graphql(QUERY, {
  options: ({ user }) => ({ variables: { userId: user.get('id') } }),
  skip: ({ user }) => user.isEmpty(),
});

export default compose(
  injectIntl,
  Connect,
  withCurrentBusiness,
)(BusinessDetailsContainer);

