import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { setSelection } from 'redux/reducers/catalog/actions';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  RefreshIcon,
  PencilIcon,
  MoreVertIcon,
  VisibilityOnIcon,
} from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from '../../../ProductCatalog.scss';

import selector from './selector';

import { injectIntl, intlShape } from 'react-intl';

import RootCloseWrapper from 'components/bootstrap/RootCloseWrapper';

const tooltipAlign = {
  offset: [0, -4],
};

function MoreActions({ ...props }) {
  return (
    <Button {...props}>
      <MoreVertIcon size={24}/>
    </Button>
  );
}

class Actions extends React.PureComponent {
  constructor() {
    super();

    this.onClose = this.onClose.bind(this);
    this.preventMouseRootClose = this.preventMouseRootClose.bind(this);
  }
  onClose() {
    this.props.actions.clearAllSelections();
  }
  preventMouseRootClose(e) {
    let el = e.target;
    while (el !== document.body) {
      if (el.hasAttribute('data-root-close-ignore')) {
        return true;
      }
      el = el.parentNode;
    }

    return false;
  }
  render() {
    const { hasSelection } = this.props;
    if (!hasSelection) {
      return null;
    }

    return (
      <RootCloseWrapper event='mousedown' preventMouseRootClose={this.preventMouseRootClose} onRootClose={this.onClose}>
        <div className={style.actions}>
          <div key='refresh' className={style.refresh}>
            <Tooltip align={tooltipAlign} placement='bottom' overlay={'Refresh'}>
              <Button className={style.refreshButton} onClick={null} role='button'>
                <RefreshIcon size={24}/>
              </Button>
            </Tooltip>
          </div>
          <div key='edit' className={style.edit}>
            <Tooltip align={tooltipAlign} placement='bottom' overlay={'Edit product'}>
              <Button className={style.editButton} onClick={null} role='button'>
                <PencilIcon size={24}/>
              </Button>
            </Tooltip>
          </div>
          <div key='visibility' className={style.visibility}>
            <Tooltip align={tooltipAlign} placement='bottom' overlay={'Make private'}>
              <Button className={style.visibilityButton} onClick={null} role='button'>
                <VisibilityOnIcon size={24}/>
              </Button>
            </Tooltip>
          </div>
          <div key='more' className={style.more}>
            <Dropdown>
              <Dropdown.Toggle componentClass={MoreActions} className={style.moreActionsButton} role='button'/>
              <Dropdown.Menu className={style.moreMenu}>
                <MenuItem>Create RFQ</MenuItem>
                <MenuItem>Add label</MenuItem>
                <MenuItem>Make a copy</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div key='divider' className={style.divider}></div>
        </div>
      </RootCloseWrapper>
    );
  }
}

Actions.propTypes = {
  actions       : T.shape({
    clearAllSelections : T.func.isRequired,
  }),
  intl          : intlShape.isRequired,
  hasSelection  : T.number.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({
      clearAllSelections: () => setSelection([]),
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(Actions);

