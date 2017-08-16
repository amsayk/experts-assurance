import React from 'react';

import { CloseIcon, DoneIcon, FolderIcon } from 'components/icons/MaterialIcons';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import Button from 'components/bootstrap/Button';

const Item = connect(
  createSelector(
    (state, { doc }) => ({
      isValid: state.getIn(['importation', 'validations']).includes(doc.id),
      isError: state.getIn(['importation', 'validationErrors']).includes(doc.id),
    }),
    ({ isValid, isError }) => ({ validity: { isValid, isError } }),
  ),
)(function({ doc, validity: { isValid, isError } }) {
  return (
    <li>
      <div style={styles.doc}>
        <div
          className={cx(isValid && style.valid, isError && style.errorDoc)}
          style={styles.icon}
        >
          {(function() {
            if (isError) {
              return <CloseIcon size={18} />;
            }
            if (isValid) {
              return <DoneIcon size={18} />;
            }
            return <FolderIcon size={18} />;
          })()}
        </div>
        <div style={styles.id}>
          Dossier <b>{doc.id}</b>
        </div>
      </div>
    </li>
  );
});

class DocsList extends React.Component {
  render() {
    const { docs, actions } = this.props;

    return (
      <div style={styles.wrapper}>
        <ul style={styles.body}>
          {docs.isEmpty()
            ? <li style={{ marginBottom: 12 }}>Aucuns dossiers à validés.</li>
            : docs.map(f => <Item key={f.id} doc={f} />)}
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

const selector = createSelector(docsSelector, docs => ({ docs }));

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
