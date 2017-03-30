import React, { PropTypes as T } from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import Button from 'components/bootstrap/Button';

import { toggle, setDuration, toggleIncludeCanceled } from 'redux/reducers/dashboard/actions';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import ActivityIndicator from 'components/ActivityIndicator';

import {
  DoneIcon,
  DownloadIcon,
} from 'components/icons/MaterialIcons';

import Switch from 'components/Switch';

import DurationSelector from '../DurationSelector';

import List from './Closed_List';

class Closed extends React.Component {
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
    const { includeCanceled, closedDashboardIsOpen, durationInDays, data, loadMore, actions } = this.props;
    const summary = data.length && data.cursor ? <span style={{
      color: 'rgba(112, 112, 112, 0.85)',
      fontSize: 13,
      verticalAlign: 'middle',
    }}> · {data.length} dossiers</span>  : null;
    return (
      <div className={cx(style.board, closedDashboardIsOpen && style.dashboardOpen, style.boardPending)}>
        <header onClick={this._handleToggle} ref={(header) => this.header = header} className={style.boardHeader}>
          <div style={{
            paddingLeft: 10,
          }} className={cx(style['CLOSED'], style.boardIcon)}>
          <DoneIcon size={18}/>
        </div>
        <h5 className={style.boardTitle}>Dossiers clos {summary}</h5>
        <div className={style.ctrls}>
          <div className={style.icon}>
            {data.loading ? <ActivityIndicator size='small'/> : null}
          </div>
          <div className={style.icon}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <div style={{
              fontSize: 12,
              color: '#707070',
            }}>
            Inclure les dossiers annulés
          </div>
          <div style={{
            marginLeft: 6,
            marginRight: 6,
          }}>
          <Switch
            value={includeCanceled}
            onValueChange={actions.toggleIncludeCanceled}
          />
        </div>
      </div>
    </div>
    <div className={style.icon}>
      <DurationSelector
        label='Durée de clôture'
        duration={durationInDays}
        onDuration={actions.setDuration}
      />
    </div>
  </div>
      </header>
      {closedDashboardIsOpen ? <div className={style.boardContent}>
        <List
          loadMore={loadMore}
          {...data}
        />
          </div> : null}
        </div>
    );
  }
}

Closed.defaultProps = {
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
      toggle : (...args) => toggle('closed', ...args),
      setDuration : (...args) => setDuration('closed', ...args),
      toggleIncludeCanceled,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
  DataLoader.closedDocs,
)(Closed);

