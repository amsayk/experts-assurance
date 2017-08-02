import React from 'react';

import { PlusIcon, UploadIcon } from 'components/icons/MaterialIcons';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import Dropzone from 'react-dropzone';

import { addFiles } from 'redux/reducers/importation/actions';

import { ACCEPT } from 'redux/reducers/importation/constants';

const styles = {
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '10px 20px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  error: {
    lineHeight: 1.5,
    color: 'rgb(244, 67, 54)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 35,
    padding: 16,
    border: '1px solid',
    fontWeight: 500,
    width: '80%',
  },
};

class FileChooser extends React.Component {
  constructor(props) {
    super(props);

    // this.onExtract = this.onExtract.bind(this);

    this.onFiles = this.onFiles.bind(this);

    this.state = {};
  }
  // onExtract() {
  //   const self = this;
  //   self.setState(
  //     {
  //       error: null,
  //       dropzoneEnter: false,
  //       dragging: false,
  //     },
  //     async () => {
  //       try {
  //         await Promise.all(self.props.files.map(async metadata => {}));
  //
  //         // Successfully extracted!
  //         self.setState(
  //           {
  //             error: null,
  //           });
  //       } catch (e) {
  //         self.setState({
  //           error: e.message,
  //         });
  //       }
  //     },
  //   );
  // }

  onFiles(files) {
    const self = this;
    self.props.actions.addFiles(files);
  }

  render() {
    const { files, extracting, error } = this.props;

    if (extracting) {
      return null;
    }

    return (
      <Dropzone
        disableClick={extracting}
        style={styles.body}
        className={style.files}
        activeClassName={cx(style.filesDrag, style.filesDragEnter)}
        rejectClassName={cx(
          style.filesDrag,
          style.filesDragEnter,
          style.filesDragReject,
        )}
        accept={ACCEPT}
        disablePreview
        maxSize={Infinity}
        onDrop={this.onFiles}
      >
        {({ isDragActive, isDragReject }) => {
          if (isDragActive) {
            return (
              <div className={style.fileEntryDropIntro}>
                <div key='icon' className={style.filesIcon}>
                  <UploadIcon className={style.files__icon} size={48} />
                </div>
                <div style={{ marginLeft: 6 }} className={style.fileDisplayName}>
                  <h3 style={{ marginTop: 25 }}>Déposez les fichiers ici.</h3>
                </div>
              </div>
            );
          }

          if (isDragReject) {
            return (
              <div className={style.fileEntryDropIntro}>
                <div style={{ marginLeft: 6 }} className={style.fileDisplayName}>
                  <h3>Fichiers invalides.</h3>
                </div>
              </div>
            );
          }

          return (
            <div className={style.fileEntryDropIntro}>
              <div key='icon' className={style.filesIcon}>
                <PlusIcon size={48} />
              </div>
              <div key='label' className={style.fileDisplayName}>
                <h3>Ajouter…</h3>
              </div>
            </div>
          );
        }}
      </Dropzone>
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
        addFiles,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(FileChooser);
