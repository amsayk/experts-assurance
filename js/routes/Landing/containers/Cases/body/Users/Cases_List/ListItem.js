import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER, PATH_CASES_CASE } from 'vars';

import {
  CloseIcon,

  UnknownIcon,
  WatchIcon,
  DoneIcon,
  InvalidIcon,

  CheckboxIcon,
} from 'components/icons/MaterialIcons';

import { injectIntl, intlShape } from 'react-intl';

const selectionSelector = (state) => state.getIn(['cases', 'selection', 'keys']);
const keySelector = (_, { item }) => item.id;

const selector = createSelector(
  selectionSelector,
  keySelector,
  (selection, key) => ({
    isSelected: selection.includes(key),
    hasSelection: !selection.isEmpty(),
  }),
);

const STATE_ICON = {
  PENDING : <UnknownIcon className={style.stateIcon} size={32}/>,
  OPEN    : <WatchIcon   className={style.stateIcon} size={32}/>,
  CLOSED  : <DoneIcon    className={style.stateIcon} size={32}/>,
  INVALID : <InvalidIcon className={style.stateIcon} size={32}/>,
};

function StateIcon({ isSelected, hasSelection, state, onClick }) {
  const selecting = isSelected || hasSelection;
  return (
    <div className={cx(style.icon, style.state, style[state], selecting && style.selecting)}>
      {isSelected
        ? <CheckboxIcon.Checked onClick={onClick} className={style.checkbox} size={32}/>
        : <CheckboxIcon.Blank onClick={onClick} className={style.checkbox} size={32}/>}
      {STATE_ICON[state]}
    </div>
  );
}

class ListItem extends React.Component {
  constructor() {
    super();

    this.onItem = this.onItem.bind(this);
  }

  onItem() {
    this.props.onItem(this.props.item.id);
  }
  render() {
    const { isSelected, hasSelection, intl, className, tabIndex, role, item } = this.props;
    const { id, refNo, state, client, insurer, vehicle, date } = item;
    return (
      <div data-root-close-ignore role={role} tabIndex={tabIndex} className={cx(style.listItemWrapper, className, { [style.isSelected]: isSelected })}>

        <div className={style.listItemRef}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <StateIcon
                  state={state}
                  hasSelection={hasSelection}
                  isSelected={isSelected}
                  onClick={this.onItem}
                />
                <div className={style.text}>
                  <Link to={PATH_CASES_CASE + '/' + id}>
                    #{refNo}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemClient}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + client.id}>
                    {client.displayName}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemInsurer}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {insurer ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + insurer.id}>
                    {insurer.displayName}
                  </Link> : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemInsurer}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {insurer ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + insurer.id}>
                    {insurer.displayName}
                  </Link> : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemVehicle}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>{vehicle.model}, {vehicle.plateNumber}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item} title={intl.formatDate(date)}>
                <div className={style.text}>
                  {intl.formatRelative(date)}
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
  tabIndex   : T.string.isRequired,
  role       : T.string.isRequired,
  isSelected : T.bool.isRequired,
  index      : T.any.isRequired,
  item       : T.shape({
    id          : T.string.isRequired,
    refNo       : T.string.isRequired,
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
)(ListItem);

