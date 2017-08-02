import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import { DownloadIcon } from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Search/styles';

import { injectIntl, intlShape } from 'react-intl';

const tooltipAlign = {
  offset: [0, -4],
};

class Actions extends React.PureComponent {
  constructor() {
    super();

    this.onClose = this.onClose.bind(this);
  }
  onClose() {}

  render() {
    const { length } = this.props;
    if (length === 0) {
      return null;
    }

    return (
      <div className={style.actions}>
        <div key='download' className={style.download}>
          <Tooltip
            align={tooltipAlign}
            placement='bottom'
            overlay={'Télécharger'}
          >
            <Button
              className={style.downloadButton}
              onClick={null}
              role='button'
            >
              <DownloadIcon size={32} />
            </Button>
          </Tooltip>
        </div>
        <div key='divider' className={style.divider} />
      </div>
    );
  }
}

Actions.propTypes = {
  intl: intlShape.isRequired,
  length: T.number.isRequired,
};

export default compose(injectIntl)(Actions);
