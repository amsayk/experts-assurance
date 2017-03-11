import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import selector from './selector';

import style from 'routes/Settings/styles';

import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import { COUNTRY } from 'vars';

import QUERY from './currentUser.query.graphql';

import BusinessDetailsForm from './BusinessDetailsForm';

function BusinessDetailsContainer({ intl, user, data: { loading, currentUser }, actions }) {
  const currentBusiness = currentUser && currentUser.business;
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })}/>
      <Header onLogOut={actions.logOut}/>
      <div className={style.body}>
        <Sidebar user={user} selectedMenuItem={'business.settings'}/>
        {loading ? null : <BusinessDetailsForm user={user} intl={intl} initialValues={{
          id            : currentBusiness ? currentBusiness.id                 : null,
          displayName   : currentBusiness ? currentBusiness.displayName        : null,
          description   : currentBusiness ? currentBusiness.description        : null,
          url           : currentBusiness ? currentBusiness.url                : null,
          country       : currentBusiness ? currentBusiness.country || COUNTRY : COUNTRY,
          addressLine1  : currentBusiness ? currentBusiness.addressLine1       : null,
          addressLine2  : currentBusiness ? currentBusiness.addressLine2       : null,
          city          : currentBusiness ? currentBusiness.city               : null,
          stateProvince : currentBusiness ? currentBusiness.stateProvince      : null,
          postalCode    : currentBusiness ? currentBusiness.postalCode         : null,
          phone         : currentBusiness ? currentBusiness.phone              : null,
          taxId         : currentBusiness ? currentBusiness.taxId              : null,
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

const withCurrentUserAndBusiness = graphql(QUERY, {
  options: ({ user }) => ({
    variables: { id: user.id },
  }),
  skip: ({ user }) => user.isEmpty,
});

export default compose(
  injectIntl,
  Connect,
  withCurrentUserAndBusiness,
)(BusinessDetailsContainer);

