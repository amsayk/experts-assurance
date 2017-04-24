import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { setSelection } from 'redux/reducers/users/actions';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  RefreshIcon,
  // MoreVertIcon,
  TrashIcon,
} from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Settings/styles';

import selector from './selector';

import { injectIntl, intlShape } from 'react-intl';

import RootCloseWrapper from 'components/bootstrap/RootCloseWrapper';

const tooltipAlign = {
  offset: [0, -4],
};

// function MoreActions({ ...props }) {
//   return (
//     <Button {...props}>
//       <MoreVertIcon size={24}/>
//     </Button>
//   );
// }

class Actions extends React.PureComponent {
  constructor() {
    super();

    this.onClose = this.onClose.bind(this);
  }
  onClose() {
    this.props.actions.clearAllSelections();
  }

  render() {
    const { user, hasSelection } = this.props;
    if (!hasSelection || !user.isAdmin) {
      return null;
    }

    return (
      <RootCloseWrapper event='mousedown' onRootClose={this.onClose}>
        <div className={style.actions}>
          <div key='refresh' className={style.refresh}>
            <Tooltip align={tooltipAlign} placement='bottom' overlay={'Rafraîchir'}>
              <Button className={style.refreshButton} onClick={null} role='button'>
                <RefreshIcon size={24}/>
              </Button>
            </Tooltip>
          </div>
          {/* <div key='delete' className={style.delete}> */}
          {/*   <Tooltip align={tooltipAlign} placement='bottom' overlay={'Supprimer'}> */}
          {/*     <Button className={style.deleteButton} onClick={null} role='button'> */}
          {/*       <TrashIcon size={24}/> */}
          {/*     </Button> */}
          {/*   </Tooltip> */}
          {/* </div> */}
          {/* <div key='more' className={style.more}> */}
          {/*   <Dropdown> */}
          {/*     <Dropdown.Toggle componentClass={MoreActions} className={style.moreActionsButton} role='button'/> */}
          {/*     <Dropdown.Menu className={style.moreMenu}> */}
          {/*       <MenuItem>Changer le role</MenuItem> */}
          {/*       <MenuItem>Désactiver le compte</MenuItem> */}
          {/*       <MenuItem>Activer le compte</MenuItem> */}
          {/*     </Dropdown.Menu> */}
          {/*   </Dropdown> */}
          {/* </div> */}
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

