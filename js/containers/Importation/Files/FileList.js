import React from 'react';

import { AttachmentIcon, TrashIcon } from 'components/icons/MaterialIcons';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import { removeFile } from 'redux/reducers/importation/actions';

import Button from 'components/bootstrap/Button';

const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    width: '45%',
    marginTop: 25,
  },

  icon: {
    display: 'flex',
    transform: 'rotate(90deg)',
    marginRight: 6,
    color: '#bbb',
  },

  name: {
    flex: 3,
    fontWeight: 700,
  },

  file: {
    display: 'flex',
    flexDirection: 'row',
  },

  action: {
    alignSelf: 'flex-end',
    cursor: 'pointer',
    color: '#ddd',
    transform: 'rotate(15deg)',
  },
};

class FileList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { mutations = true, files, extracting, actions } = this.props;

    if (files.isEmpty()) {
      return null;
    }

    return (
      <ul style={styles.body}>
        {files.map(f =>
          <li>
            <div style={styles.file}>
              <div style={styles.icon}>
                <AttachmentIcon size={18} />
              </div>
              <div style={styles.name}>
                {f.name}
              </div>
              {extracting || mutations === false
                ? null
                : <div className={style.removeLink} style={styles.action}>
                    <Button
                      bsStyle='link'
                      onClick={actions.removeFile.bind(this, f)}
                    >
                      <TrashIcon size={18} />
                    </Button>
                  </div>}
            </div>
          </li>,
        )}
      </ul>
    );
  }
}

const filesSelector = state => {
  return state.getIn(['importation', 'files']);
};

const extractingSelector = state => {
  return state.getIn(['importation', 'extracting']);
};

const selector = createSelector(
  filesSelector,
  extractingSelector,
  (files, extracting) => ({ files, extracting }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        removeFile,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(FileList);
