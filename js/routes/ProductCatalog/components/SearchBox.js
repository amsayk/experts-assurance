import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import MenuItem from 'components/bootstrap/MenuItem';
import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';

import { CloseIcon, SearchIcon } from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import style from '../ProductCatalog.scss';

import Tooltip from 'components/react-components/Tooltip';

import cx from 'classnames';

import Placeholder from './Placeholder';
import LabelPlaceholder from './LabelPlaceholder';

import {
  PATH_PRODUCT_CATALOG_BASE,
  PATH_PRODUCT_CATALOG_PRODUCT_BASE,
  PATH_PRODUCT_CATALOG_LABEL_BASE,
} from 'vars';

const tooltipAlign = {
  offset: [0, -4],
};

export default function SearchBox({ recent, intl, onSearch, onClose }) {
  return (
    <Dropdown componentClass={'div'} open onToggle={onClose} className={style.searchFieldWrapper} role='search'>
      <div className={cx(style.searchField, style.active, style.hasContent)}>
        <Tooltip align={tooltipAlign} placement='bottom' overlay={'Search catalog'}>
          <Button onClick={onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
            <SearchIcon size={22}/>
          </Button>
        </Tooltip>
        <div className={style.inputWrapper}>
          <input
            className={style.input}
            autoFocus
            autoComplete='off'
            autoCorrect='off'
            placeholder='Search catalog'
            type='text'
            spellCheck='false'
            style={{ outline: 'none' }}
          />
        </div>
        <Button onClick={onClose} bsStyle={'link'} className={style.clearSearch} role='button'>
          <CloseIcon size={22}/>
        </Button>
      </div>
      <Dropdown.Menu className={style.searchBoxMenu}>
        <MenuItem Placeholder={Placeholder} header componentClass={Header} title={'Recent'}/>
        {recent.labels.concat(recent.products).map((productOrLabel, index) => {
          if (productOrLabel.slug) {
            return (
              <MenuItem url={PATH_PRODUCT_CATALOG_BASE + '/' + PATH_PRODUCT_CATALOG_LABEL_BASE + '/' + productOrLabel.slug} key={productOrLabel.id} eventKey={index} Placeholder={LabelPlaceholder} componentClass={ListItem} item={productOrLabel} intl={intl}/>
            );
          } else {
            return (
              <MenuItem url={PATH_PRODUCT_CATALOG_BASE + '/' + PATH_PRODUCT_CATALOG_PRODUCT_BASE + '/' + productOrLabel.id} key={productOrLabel.id} eventKey={index} Placeholder={Placeholder} componentClass={ListItem} item={productOrLabel} intl={intl}/>
            );
          }
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function Header({ title }) {
  return (
    <div className={style.menuSectionTitleRow}>
      <div className={style.menuSectionTitle}>
        <span>{title}</span>
      </div>
    </div>
  );
}

function ListItem({ intl, item, url, role, Placeholder }) {
  return (
    <div role={role} className={style.menuItem}>
      <Link to={url}>
        <div className={style.icon}>
          <span className={style.iconWrapper}>
            <Placeholder/>
            <span className={style.iconOverlay} />
          </span>
        </div>
        <div className={style.content}>
          <div className={style.title}>
            <span>{item.displayName}</span>
          </div>
          {item.updatedAt ? <div className={style.subtitle}>
            <div className={style.entryByLine}>
              <span>
                <span className={style.timeAgo}>{intl.formatRelative(item.updatedAt)}</span>
              </span>
              <span>
              </span>
            </div>
          </div> : null}
        </div>
      </Link>
    </div>
  );
}

SearchBox.propTypes = {
  recent   : T.shape({
    labels : T.arrayOf(T.shape({
      slug : T.string.isRequired,
      displayName : T.string.isRequired,
      color : T.string,
    }).isRequired).isRequired,
    products: T.arrayOf(T.shape({
      id : T.string.isRequired,
      displayName : T.string.isRequired,
      brandName : T.string,
      createdAt : T.number.isRequired,
      updatedAt : T.number.isRequired,
    }).isRequired).isRequired,
  }).isRequired,
  onClose  : T.func.isRequired,
  onSearch : T.func.isRequired,
  intl     : intlShape.isRequired,
};

SearchBox.defaultProps = {
};

