import React, { PropTypes as T } from 'react';
import { Link, withRouter } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER, PATH_CASES_CASE } from 'vars';

import {
  CloseIcon,

  // UnknownIcon,
  WatchIcon,
  DoneIcon,
  CanceledIcon,

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
  // PENDING  : <UnknownIcon   className={style.stateIcon} size={24}/>,
  OPEN     : <WatchIcon     className={style.stateIcon} size={24}/>,
  CLOSED   : <DoneIcon      className={style.stateIcon} size={24}/>,
  CANCELED : <CanceledIcon  className={style.stateIcon} size={24}/>,
};

function StateIcon({ isSelected, hasSelection, state, onClick }) {
  const selecting = isSelected || hasSelection;
  return (
    <div className={cx(style.icon, style.state, style[state], selecting && style.selecting)}>
      {isSelected
        ? <CheckboxIcon.Checked onClick={onClick} className={cx(style.checkbox, style.isSelected)} size={24}/>
        : <CheckboxIcon.Blank onClick={onClick} className={style.checkbox} size={24}/>}
        {STATE_ICON[state]}
      </div>
  );
}

class ListItem extends React.Component {
  constructor() {
    super();

    this.onItem = this.onItem.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (e.target.nodeName !== 'A' && (e.target.parentNode ? e.target.parentNode.nodeName !== 'A' : false)) {
      e.preventDefault();
      e.stopPropagation();
      this.props.router.push(
        PATH_CASES_CASE + '/' + this.props.item.id,
      );
    }
  }

  onItem() {
    this.props.onItem(this.props.item.id);
  }
  render() {
    const { isSelected, hasSelection, intl, className, tabIndex, role, item } = this.props;
    const { id, refNo, company, state, client, agent, vehicle, date } = item;
    return (
      <div onClickCapture={this.handleClick} data-root-close-ignore role={role} tabIndex={tabIndex} className={cx(style.listItemWrapper, className, { [style.isSelected]: isSelected })}>

        <div style={{}} className={style.listItemCompany}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {company || '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemRef}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                {/* <StateIcon */}
                  {/*   state={state} */}
                  {/*   hasSelection={hasSelection} */}
                  {/*   isSelected={isSelected} */}
                  {/*   onClick={this.onItem} */}
                  {/* /> */}
                <div className={style.text}>
                  <Link to={PATH_CASES_CASE + '/' + id}>
                    <b>{refNo}</b>
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

        <div className={style.listItemManager}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {agent ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + agent.id}>
                    {agent.displayName}
                  </Link> : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemAgent}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {vehicle.model || vehicle.manufacturer}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemVehicle}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {vehicle.plateNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {intl.formatDate(date)}
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
  withRouter,
  injectIntl,
  Connect,
)(ListItem);

