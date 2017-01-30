import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import MaterialIcon from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import Tooltip from 'components/react-components/Tooltip';

import style from '../../../ProductCatalog.scss';

const icon = <MaterialIcon name={'search'} size={32}/>;

const align = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

export default function SearchBox({ intl, toggleSearch }) {
  return (
    <div className={style.search}>
      <Button className={style.searchBtn} onClick={toggleSearch}>
        <Tooltip align={align} overlay={'Search'}>
          {icon}
        </Tooltip>
      </Button>
    </div>
  );
}

SearchBox.propTypes = {
  toggleSearch : T.func.isRequired,
  intl : intlShape.isRequired,
};
