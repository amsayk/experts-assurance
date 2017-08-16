import React from 'react';

import { CloseIcon, DoneIcon, WatchIcon } from 'components/icons/MaterialIcons';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import Button from 'components/bootstrap/Button';

function Item({ doc, progress }) {
  const isDone = progress && doc.progress <= progress;
  return (
    <li>
      <div style={styles.doc}>
        <div className={cx(isDone && style.valid)} style={styles.icon}>
          {(function() {
            if (isDone) {
              return <DoneIcon size={18} />;
            }
            return <WatchIcon size={18} />;
          })()}
        </div>
        <div style={styles.id}>
          Dossier <b>{doc.id}</b>
        </div>
      </div>
    </li>
  );
}

class DocsList extends React.Component {
  render() {
    const { docs, progress, actions } = this.props;

    return (
      <div style={styles.wrapper}>
        <ul style={styles.body}>
          {docs.isEmpty()
            ? <li style={{ marginBottom: 12 }}>Aucuns dossiers à importés.</li>
            : docs.map(f => <Item progress={progress} key={f.id} doc={f} />)}
        </ul>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    overflowY: 'auto',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    width: '45%',
    height: 'calc(100vh - 102px - 52px - 33px)',
  },

  icon: {
    display: 'flex',
    marginRight: 6,
    color: '#bbb',
  },

  id: {
    flex: 3,
  },

  doc: {
    display: 'flex',
    flexDirection: 'row',
  },
};

const docsSelector = state => {
  return state.getIn(['importation', 'docs']).sortBy(doc => doc.progress);
};

const progressSelector = state => {
  return state.getIn(['importation', 'progress']);
};

const selector = createSelector(
  docsSelector,
  progressSelector,
  (docs, progress) => ({ docs, progress }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(DocsList);
