import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppBrand from 'components/AppBrand';

import messages from '../../../messages';

import style from '../../../ProductCatalog.scss';

import { injectIntl, intlShape } from 'react-intl';

import {
} from 'redux/reducers/catalog/actions';

import Tooltip from 'components/react-components/Tooltip';

import DataLoader from '../../../utils/DataLoader';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import SearchBox from '../../../components/SearchBox';
import SearchButton from '../../../components/SearchButton';

import {
  toggleSearch,
} from 'redux/reducers/catalog/actions';

import { toggleAlerts } from 'redux/reducers/app/actions';

import { logOut } from 'redux/reducers/user/actions';

import ProfileButton, { MenuItem as ProfileMenuItem } from 'components/Profile';

import Alerts from 'containers/Alerts';

import {
  StarIcon,
  PencilIcon,
  NavLeftIcon,
  MoreVertIcon,
  VisibilityOnIcon,
} from 'components/icons/MaterialIcons';

import {
  PATH_SETTINGS_BASE,
} from 'vars';

import selector from './selector';

const tooltipAlign = {
  offset: [0, -4],
};

const starTooltipAlign = {
  offset: [-9, -12],
};

function MoreActions({ ...props }) {
  return (
    <Button {...props}>
      <MoreVertIcon size={24}/>
    </Button>
  );
}

class Header extends React.Component {
  constructor() {
    super();

    this.onBack = this.onBack.bind(this);
  }
  onBack(event) {
    event.preventDefault();
    this.props.onBack();
  }
  render() {
    const { intl, user, recent, catalog, app, product, actions } = this.props;
    const { searchOpen } = catalog;
    const { alertsOpen } = app;

    const menus = searchOpen ? [
      <SearchBox key='searchBox' recent={recent} intl={intl} onClose={actions.toggleSearch}/>,
    ] : [
      <div key='edit' className={style.edit}>
        <Tooltip align={tooltipAlign} placement='bottom' overlay={'Edit product'}>
          <Button className={style.editButton} onClick={null} role='button'>
            <PencilIcon size={24}/>
          </Button>
        </Tooltip>
      </div>,
      <div key='visibility' className={style.visibility}>
        <Tooltip align={tooltipAlign} placement='bottom' overlay={'Make private'}>
          <Button className={style.visibilityButton} onClick={null} role='button'>
            <VisibilityOnIcon size={24}/>
          </Button>
        </Tooltip>
      </div>,
      <div key='more' className={style.more}>
        <Dropdown>
          <Dropdown.Toggle componentClass={MoreActions} className={style.moreActionsButton} role='button'/>
          <Dropdown.Menu className={style.moreMenu}>
            <MenuItem>Create RFQ</MenuItem>
            <MenuItem>Add label</MenuItem>
            <MenuItem>Make a copy</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>,
      <div key='divider' className={style.divider}></div>,
      <SearchButton key='searchButton' intl={intl} toggleSearch={actions.toggleSearch}/>,
      <Alerts key='alerts' toggleAlerts={actions.toggleAlerts} intl={intl} alertsOpen={alertsOpen}/>,
      <ProfileButton key='userProfile' user={user}>
        <MenuItem componentClass={ProfileMenuItem} user={user}/>
        <MenuItem componentClass={Link} to={PATH_SETTINGS_BASE}>
          {intl.formatMessage(messages.manageAccount)}
        </MenuItem>
        <MenuItem divider/>
        <MenuItem onClick={actions.logOut}>
          {intl.formatMessage(messages.logOut)}
        </MenuItem>
      </ProfileButton>,
    ];

    return (
      <nav className={style.navbar}>
        <div className={style.leftNav}>
          <div className={style.back}>
            <Tooltip align={tooltipAlign} placement='bottomLeft' overlay={'Back to products'}>
              <Button className={style.backButton} onClick={this.onBack} role='button'>
                <NavLeftIcon size={32}/>
              </Button>
            </Tooltip>
          </div>
          <div className={style.productInfo}>
            <div className={style.productLine}>
              <div className={style.productName}>
                {product ? product.displayName : null}
              </div>
              <div className={style.date}>{product ? intl.formatRelative(product.updatedAt) : null}</div>
            </div>
            <div className={style.productStar}>
              <Tooltip align={starTooltipAlign} placement='bottom' overlay={'Add to favorites'}>
                <Button onClick={null} className={style.productStarButton} role='button'>
                  <StarIcon.Empty size={32}/>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className={style.middleNav}>
          <AppBrand/>
        </div>

        <div className={style.rightNav}>
          {menus}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  intl    : intlShape.isRequired,
  user: T.shape({
    displayName: T.string.isRequired,
    email: T.string.isRequired,
  }),
  onBack  : T.func.isRequired,
  product : T.shape({

  }),
  catalog  : T.shape({
    searchOpen: T.bool.isRequired,
  }),
  app  : T.shape({
    alertsOpen: T.bool.isRequired,
  }),
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      logOut,
      toggleSearch,
      toggleAlerts,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.catalogRecent,
)(Header);

