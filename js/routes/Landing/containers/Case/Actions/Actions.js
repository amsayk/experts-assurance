import React, { PropTypes as T } from 'react';
import { compose } from 'redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  RefreshIcon,
  MoreVertIcon,
  TrashIcon,
  ArchiveIcon,
  PrintIcon,
} from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Landing/styles';

import { injectIntl, intlShape } from 'react-intl';

const tooltipAlign = {
  offset: [0, -4],
};

function MoreActions({ ...props }) {
  return (
    <Button {...props}>
      <MoreVertIcon size={18}/>
    </Button>
  );
}

class Actions extends React.PureComponent {
  constructor() {
    super();

  }

  render() {
    const {} = this.props;

    return (
      <div className={style.actions}>
        {/* <div key='refresh' className={style.refresh}> */}
        {/*   <Tooltip align={tooltipAlign} placement='bottom' overlay={'Rafraîchir'}> */}
        {/*     <Button className={style.refreshButton} onClick={null} role='button'> */}
        {/*       <RefreshIcon size={18}/> */}
        {/*     </Button> */}
        {/*   </Tooltip> */}
        {/* </div> */}
        <div key='delete' className={style.delete}>
          <Tooltip align={tooltipAlign} placement='bottom' overlay={'Supprimer'}>
            <Button className={style.deleteButton} onClick={null} role='button'>
              <TrashIcon size={18}/>
            </Button>
          </Tooltip>
        </div>
        <div key='archive' className={style.archive}>
          <Tooltip align={tooltipAlign} placement='bottom' overlay={'Archiver'}>
            <Button className={style.archiveButton} onClick={null} role='button'>
              <ArchiveIcon size={18}/>
            </Button>
          </Tooltip>
        </div>
        <div key='print' className={style.print}>
          <Tooltip align={tooltipAlign} placement='bottomRight' overlay={'Imprimer'}>
            <Button className={style.printButton} onClick={null} role='button'>
              <PrintIcon size={18}/>
            </Button>
          </Tooltip>
        </div>
        {/* <div key='more' className={style.more}> */}
        {/*   <Dropdown> */}
        {/*     <Dropdown.Toggle componentClass={MoreActions} className={style.moreActionsButton} role='button'/> */}
        {/*     <Dropdown.Menu className={style.moreMenu}> */}
        {/*       <MenuItem>Action 1</MenuItem> */}
        {/*       <MenuItem>Action 2</MenuItem> */}
        {/*       <MenuItem divider/> */}
        {/*       <MenuItem>Action 3</MenuItem> */}
        {/*     </Dropdown.Menu> */}
        {/*   </Dropdown> */}
        {/* </div> */}
      </div>
    );
  }
}

Actions.propTypes = {
  intl : intlShape.isRequired,
};

export default compose(
  injectIntl,
)(Actions);

