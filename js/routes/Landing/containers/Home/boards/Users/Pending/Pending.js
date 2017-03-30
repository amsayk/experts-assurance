import React, { PropTypes as T } from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import Button from 'components/bootstrap/Button';

import { toggle, setDuration } from 'redux/reducers/dashboard/actions';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import ActivityIndicator from 'components/ActivityIndicator';

import {
  UnknownIcon,
  DownloadIcon,
} from 'components/icons/MaterialIcons';

import DurationSelector from '../DurationSelector';

import List from './Pending_List';

class Pending extends React.Component {
  constructor() {
    super();

    this._handleToggle = this._handleToggle.bind(this);
  }

  _handleToggle(e) {
    if (e.target === this.header){
      this.props.actions.toggle();
    }
  }
  render() {
    const { pendingDashboardIsOpen, durationInDays, data, loadMore, actions } = this.props;
    const summary = data.length && data.cursor ? <span style={{
      color: 'rgba(112, 112, 112, 0.85)',
      fontSize: 13,
      verticalAlign: 'middle',
    }}> · {data.length} dossiers</span>  : null;

    return (
      <div className={cx(style.board, pendingDashboardIsOpen && style.dashboardOpen, style.boardPending)}>
        <header onClick={this._handleToggle} ref={(header) => this.header = header} className={style.boardHeader}>
          <div style={{
            paddingLeft: 10,
          }} className={cx(style['PENDING'], style.boardIcon)}>
          <UnknownIcon size={18}/>
        </div>
        <h5 className={style.boardTitle}>Dossiers en attente {summary}</h5>
        <div className={style.ctrls}>
          <div className={style.icon}>
            {data.loading ? <ActivityIndicator size='small'/> : null}
          </div>
          <div className={cx(style.icon, style.download)}>
            <Button className={style.downloadButton} role='button'>
              <DownloadIcon
                size={18}
              />
            </Button>
          </div>
          <div className={style.icon}>
            <DurationSelector
              label='Durée en attente'
              duration={durationInDays}
              onDuration={actions.setDuration}
            />
          </div>
        </div>
      </header>
      {pendingDashboardIsOpen ? <div className={style.boardContent}>
        <List
          loadMore={loadMore}
          {...data}
        />
      </div> : null}
    </div>
    );
  }
}

Pending.defaultProps = {
  data: {
    loading: false,
    length: 0,
    cursor: 0,
    docs: [],
  },
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      toggle : (...args) => toggle('pending', ...args),
      setDuration : (...args) => setDuration('pending', ...args),
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
  DataLoader.pendingDocs,
)(Pending);

