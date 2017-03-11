import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Settings/styles';

import cx from 'classnames';

import ProfilePic from 'components/Profile/ProfilePic';

import { injectIntl, intlShape } from 'react-intl';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

const selectionSelector = (state) => state.getIn(['users', 'selection', 'keys']);
const keySelector = (_, { index }) => index;

const selector = createSelector(
  selectionSelector,
  keySelector,
  (selection, key) => ({ isSelected: selection.includes(key) }),
);

class GridItem extends React.Component {
  constructor() {
    super();

    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onDoubleClick(event) {
    this.props.onItem(this.props.item.id);
  }

  render() {
    const { isSelected, intl, className, tabIndex, role, onClick, onKeyDown, item } = this.props;
    const { id, displayName, updatedAt } = item;
    return (
      <div data-root-close-ignore role={role} tabIndex={tabIndex} onClick={onClick} onDoubleClick={this.onDoubleClick} onKeyDown={onKeyDown} className={cx(style.gridItemWrapper, className, { [style.isSelected]: isSelected })}>
        <div className={style.gridItem}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.icon}>
                  <div className={style.img}>
                    <ProfilePic user={item} textSizeRatio={0.75} size='100%' square/>
                  </div>
                </div>
                <div className={style.info}>
                  <div className={style.text}>
                    <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + id}>
                      {displayName}
                    </Link>
                  </div>
                </div>
                <div className={style.bottomLine}>
                  <div className={style.date}>
                    {intl.formatRelative(updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

GridItem.propTypes = {
  intl       : intlShape.isRequired,
  onClick    : T.func.isRequired,
  onItem     : T.func.isRequired,
  onKeyDown  : T.func.isRequired,
  tabIndex   : T.string.isRequired,
  role       : T.string.isRequired,
  isSelected : T.bool.isRequired,
  index      : T.any.isRequired,
  item       : T.shape({
    id          : T.string.isRequired,
    displayName : T.string.isRequired,
    email   : T.string,
    createdAt   : T.number.isRequired,
    updatedAt   : T.number.isRequired,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(GridItem);

