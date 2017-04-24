import React, { PropTypes as T } from 'react';
import { compose } from 'redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  UndoIcon,
  // MoreVertIcon,
  TrashIcon,
  PencilIcon,
} from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

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
  render() {
    const { user, currentUser } = this.props;
    return (
      user && currentUser.isAdmin ? <div className={style.actions}>
        {/* {user.deletion ? null : <div key='edit' className={style.edit}> */}
        {/*   <Tooltip align={tooltipAlign} placement='bottom' overlay={'Modifier'}> */}
        {/*     <Button className={style.editButton} onClick={null} role='button'> */}
        {/*       <PencilIcon size={24}/> */}
        {/*     </Button> */}
        {/*   </Tooltip> */}
        {/* </div>} */}
        {/* <div key='delete' className={style.delete}> */}
        {/*   <Tooltip align={tooltipAlign} placement='bottom' overlay={'Supprimer'}> */}
        {/*     <Button className={style.deleteButton} onClick={null} role='button'> */}
        {/*       {user.deletion */}
        {/*           ? <UndoIcon size={24}/> */}
        {/*           : <TrashIcon size={24}/>} */}
        {/*         </Button> */}
        {/*       </Tooltip> */}
        {/*     </div> */}
            {/* <div key='more' className={style.more}> */}
              {/*   <Dropdown> */}
                {/*     <Dropdown.Toggle componentClass={MoreActions} className={style.moreActionsButton} role='button'/> */}
                {/*     <Dropdown.Menu className={style.userMoreMenu}> */}
                  {/*       <MenuItem>Changer le role</MenuItem> */}
                  {/*       <MenuItem>Désactiver le compte</MenuItem> */}
                  {/*     </Dropdown.Menu> */}
                {/*   </Dropdown> */}
              {/* </div> */}
            <div key='divider' className={style.divider}></div>
          </div> : null
    );
  }
}

Actions.propTypes = {
  actions       : T.shape({
  }),
  intl          : intlShape.isRequired,
};

export default compose(
  injectIntl,
)(Actions);

