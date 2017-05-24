import React, { PropTypes as T } from 'react';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import EventListener from 'react-event-listener';

import { PlusIcon, UploadIcon } from 'components/icons/MaterialIcons';

import * as codes from 'result-codes';

import emptyObject from 'emptyObject';

import { SERVER } from 'vars';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import Dropzone from 'react-dropzone';

import BlinkingDots from 'components/BlinkingDots';

import MUTATION from './uploadFile.mutation.graphql';

const ICON_SIZE = 18;

const STATUS = {
  SUCCESS   : 2,
  ERROR     : 3,
};

const ACCEPT = [
  'audio/*',
  'video/*',
  'image/*',

  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  'application/zip',

  'application/octet-stream',

  'application/x-tar',
  'application/x-gzip',
  'application/x-cpio',
  'application/x-compressed',
  'application/x-compress',
  'application/rtf',

  'application/json',

  'text/*',
].join(',');

class NewEntry extends React.PureComponent {
  static propTypes = {
    client          : T.shape({
      mutate: T.func.isRequired,
    }),

  };

  dragCount = 0;

  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.onFiles = this.onFiles.bind(this);

    this.onDrag = this.onDrag.bind(this);

    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);

    this.onFileDialogCancel = this.onFileDialogCancel.bind(this);

    this.state = {
      status : null,
      dragging : false,
      dropzoneEnter : false,
    };
  }

  onDrop(e) {
    this.dragCount = 0;
    if (this.state.dropzoneEnter || this.state.dragging) {
      this.setState({
        dropzoneEnter : false,
        dragging : false,
      });
    }
  }

  onFiles(files) {
    const self = this;
    self.dragCount = 0;
    self.setState({
      error  : null,
      dropzoneEnter : false,
      dragging : false,
      status : STATUS.UPLOADING,
      files,
    }, async () => {

      try {
        await Promise.all(self.state.files.map(async (metadata) => {
          const { data: { uploadFile: { error } } } = await self.props.client.mutate({
            refetchQueries : ['invalidDocs'],
            mutation       : MUTATION,
            variables      : {
              docId    : self.props.id,
              category : self.props.category,
              metadata : metadata,
            },
            updateQueries : {
              getTimeline(prev, { mutationResult, queryVariables }) {
                const newFile = mutationResult.data.uploadFile.file;
                const newActivities = mutationResult.data.uploadFile.activities;

                if (prev && newActivities && newActivities.length) {

                  if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== self.props.id ) {
                    return prev;
                  }

                  return {
                    timeline : {
                      cursor : prev.timeline.cursor,
                      result : [
                        ...newActivities,
                        ...prev.timeline.result,
                      ],
                    },
                  };
                }

                return prev;
              },
              getDocFiles(prev, { mutationResult, queryVariables }) {
                const newFile = mutationResult.data.uploadFile.file;

                if (prev && newFile) {

                  if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== self.props.id ) {
                    return prev;
                  }

                  const files = [
                    newFile,
                    ...prev.getDocFiles,
                  ];
                  return {
                    getDocFiles : files,
                  };
                }

                return prev;
              },
            },
          });

          if (error) {
            switch (error.code) {
              case codes.ERROR_ACCOUNT_NOT_VERIFIED:
              case codes.ERROR_NOT_AUTHORIZED:
                throw new Error(
                  `Vous n'êtes pas authorisé`,
                );
              default:
                throw new Error(
                  'Erreur inconnu, veuillez réessayer à nouveau.',
                );
            }
          }

          // self.setState(({ files }) => ({
          //   files : files.filter((f) => f.name !== metadata.name),
          // }));
        }));

        // Successfully saved!
        self.setState({
          status : STATUS.SUCCESS,
          files  : [],
          error  : null,
        }, () => {
          setTimeout(() => {
            self.setState({
              status : null,
              files  : [],
              error  : null,
            });
          }, 2 * 1000);
        });
      } catch (e) {

        self.setState({
          status : STATUS.ERROR,
          error  : e.message,
        }, () => {
          setTimeout(() => {
            self.setState({
              status : null,
              // files  : [],
              error  : null,
            });
          }, 2 * 1000);
        });
      }
    });
  }

  onDrag(e) {
    e.preventDefault();
    this.dragCount += (e.type === 'dragenter' ? 1 : -1);
    if (this.dragCount === 1) {
      if (this.state.dragging === false) {
        this.setState({
          dragging : true,
        });
      }
    } else if (this.dragCount === 0) {
      if (this.state.dragging === true) {
        this.setState({
          dragging : false,
        });
      }
    }
  }

  onDragEnter() {
    if (this.state.status) {
      return;
    }
    this.setState({
      dropzoneEnter : true,
    });
  }
  onDragLeave() {
    if (this.state.status) {
      return;
    }
    this.setState({
      dropzoneEnter : false,
    });
  }

  onFileDialogCancel() {
  }

  render() {
    const { height } = this.props;
    const { status, dragging, dropzoneEnter } = this.state;
    return (
      <Dropzone
        disableClick={status !== null}
        style={dragging || dropzoneEnter || status ? {height : height + 13} : emptyObject}
        className={cx(style.newFileEntry, !status && dragging && style.newFileEntryDrag, !status && dropzoneEnter && style.newFileEntryDragEnter)}
        accept={ACCEPT}
        disablePreview
        maxSize={Infinity}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onFileDialogCancel={this.onFileDialogCancel}
        onDrop={this.onFiles}
      >
        {(() => {
          if (status === STATUS.UPLOADING) {
            return (
              <div className={style.newFileEntry__uploading}>
                <BlinkingDots>
                  Sauvegarde en cours
                </BlinkingDots>
              </div>
            );
          }

          if (status === STATUS.SUCCESS) {
            return (
              <div className={style.newFileEntry__success}>
                Succès
              </div>
            );
          }

          if (status === STATUS.ERROR) {
            return (
              <div className={style.newFileEntry__error}>
                <strong>
                  Erreur! …
                </strong>
                <div>
                  Veuillez essayer encore
                </div>
              </div>
            );
          }

          if (dragging || dropzoneEnter) {
            return [
              SERVER ? null : <EventListener
                key='eventListener'
                target={document}
                onDragEnterCapture={this.onDrag}
                onDragLeaveCapture={this.onDrag}
                onDrop={this.onDrop}
              />,
              <div className={style.fileEntryDropIntro}>
                <div key='icon' className={style.fileEntryIcon}>
                  <UploadIcon className={style.newFileEntry__icon} size={48} />
                </div>
                <div key='label' style={{ marginLeft: 6 }} className={style.fileEntryDisplayName}>
                  Déposez les fichiers ici.
                </div>
              </div>
            ];
          }


          return [
            SERVER ? null : <EventListener
              key='eventListener'
              target={document}
              onDragEnterCapture={this.onDrag}
              onDragLeaveCapture={this.onDrag}
              onDrop={this.onDrop}
            />,
            <div key='icon' className={style.fileEntryIcon}>
              <PlusIcon size={ICON_SIZE} />
            </div>,
            <div key='label' className={style.fileEntryDisplayName}>
              Ajouter…
            </div>
          ];

        })()}
      </Dropzone>
    );
  }
}

export default compose(
  withApollo,
)(NewEntry);

