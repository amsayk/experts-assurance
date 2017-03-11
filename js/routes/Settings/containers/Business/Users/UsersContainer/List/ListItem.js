import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Settings/styles';

import ProfilePic from 'components/Profile/ProfilePic';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

const selectionSelector = (state) => state.getIn(['users', 'selection', 'keys']);
const keySelector = (_, { index }) => index;

const selector = createSelector(
  selectionSelector,
  keySelector,
  (selection, key) => ({ isSelected: selection.includes(key) }),
);

class ListItem extends React.Component {
  constructor() {
    super();

    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onDoubleClick(event) {
    this.props.onItem(this.props.item.id);
  }
  render() {
    const { isSelected, intl, className, tabIndex, role, onClick, onKeyDown, item } = this.props;
    const { id, displayName, email, updatedAt } = item;
    return (
      <div data-root-close-ignore role={role} tabIndex={tabIndex} onClick={onClick}  onDoubleClick={this.onDoubleClick} onKeyDown={onKeyDown} className={cx(style.listItemWrapper, className, { [style.isSelected]: isSelected })}>
        <div className={style.listItemName}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.icon}>
                  <ProfilePic user={item} textSizeRatio={2}/>
                </div>
                <div className={style.text}>
                  <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + id}>
                    {displayName}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemEmail}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>{email || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item} title={intl.formatDate(updatedAt)}>
                <div className={style.text}>
                  {intl.formatRelative(updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  intl       : intlShape.isRequired,
  onItem     : T.func.isRequired,
  onClick    : T.func.isRequired,
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
    labels      : T.arrayOf(T.shape({
      slug  : T.string.isRequired,
      displayName  : T.string.isRequired,
      color : T.string,
    })).isRequired,
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
)(ListItem);

