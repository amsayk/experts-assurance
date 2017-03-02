import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import { SearchIcon } from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Settings/styles';

const align = {
  offset: [0, -4],
};

export default function SearchButton({ intl, toggleSearch }) {
  return (
    <div className={style.search}>
      <Tooltip align={align} placement='bottomRight' overlay={'Rechercher'}>
        <Button className={style.searchBtn} onClick={toggleSearch} role='button'>
          <SearchIcon size={24}/>
        </Button>
      </Tooltip>
    </div>
  );
}

SearchButton.propTypes = {
  toggleSearch : T.func.isRequired,
  intl         : intlShape.isRequired,
};

SearchButton.defaultProps = {
};

