import React from 'react';
import T from 'prop-types';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router';
import { compose } from 'redux';

import * as codes from 'result-codes';

import { toastr } from 'containers/Toastr';

import { injectIntl } from 'react-intl';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

import memoizeStringOnly from 'memoizeStringOnly';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import { FileIcon } from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import MUTATION from './delFile.mutation.graphql';

const ICON_SIZE = 18;

const CONFIRM_MSG = (
  <div style={style.confirmToastr}>
    <h5>Êtes-vous sûr?</h5>
  </div>
);

class FileEntry extends React.PureComponent {
  static contextTypes = {
    snackbar: T.shape({
      show: T.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);

    this.state = {
      open: false,
    };
  }
  onToggle() {
    if (this._closing) {
      return;
    }
    this.setState(({ open }, { entry }) => {
      return {
        open: entry.isNew ? false : !open,
      };
    });
  }
  async delFile() {
    const self = this;
    try {
      const { data: { delFile: { error } } } = await this.props.client.mutate({
        refetchQueries: ['getDoc', 'invalidDocs', 'getTimeline', 'getDocFiles'],
        mutation: MUTATION,
        variables: {
          id: this.props.entry.id,
        },
        updateQueries: {
          // getTimeline(prev, { mutationResult, queryVariables }) {
          //   const newFile = mutationResult.data.delFile.file;
          //   const newActivities = mutationResult.data.delFile.activities;
          //
          //   if (prev && newActivities && newActivities.length) {
          //
          //     if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== self.props.id ) {
          //       return prev;
          //     }
          //
          //     return {
          //       timeline : {
          //         cursor : prev.timeline.cursor,
          //         result : [
          //           ...newActivities,
          //           ...prev.timeline.result,
          //         ],
          //       },
          //     };
          //   }
          //
          //   return prev;
          // },
          // getDocFiles(prev, { mutationResult, queryVariables }) {
          //   const newFile = mutationResult.data.delFile.file;
          //
          //   if (prev && newFile) {
          //
          //     if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== self.props.id ) {
          //       return prev;
          //     }
          //
          //     const files = prev.getDocFiles.filter((f) => f.id !== newFile.id);
          //     return {
          //       getDocFiles : files,
          //     };
          //   }
          //
          //   return prev;
          // },
        },
      });

      if (error) {
        switch (error.code) {
          case codes.ERROR_ACCOUNT_NOT_VERIFIED:
          case codes.ERROR_NOT_AUTHORIZED:
            throw new Error(`Vous n'êtes pas authorisé`);
          default:
            throw new Error('Erreur inconnu, veuillez réessayer à nouveau.');
        }
      }

      this.context.snackbar.show({
        message: 'Succès',
      });
    } catch (e) {
      this.context.snackbar.show({
        message: e.message,
      });
    }
  }
  onSelect(key) {
    this._closing = true;
    this.setState(
      {
        open: false,
      },
      () => {
        this._closing = false;

        switch (key) {
          case 'download': {
            const a = document.createElement('a');
            // a.download = this.props.entry.name;
            a.target = '_blank';
            a.href = this.props.entry.url;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
            }, 500);
            break;
          }
          case 'delete': {
            toastr.confirm(CONFIRM_MSG, {
              cancelText: 'Non',
              okText: 'Oui',
              onOk: () => {
                this.delFile();
              },
            });

            return;
          }
        }
      },
    );
  }
  render() {
    const { intl, entry } = this.props;
    return (
      <Dropdown
        onSelect={this.onSelect}
        open={this.state.open}
        onToggle={this.onToggle}
        className={cx(
          style.fileEntryDropdown,
          this.state.open && style.fileEntryOpen,
        )}
      >
        <Dropdown.Toggle componentClass={File} entry={entry} />
        <Dropdown.Menu className={style.fileEntryMenu}>
          <MenuItem
            eventKey='info'
            componentClass={Info}
            entry={entry}
            intl={intl}
          />
          <MenuItem divider />
          <MenuItem eventKey='download' className={style.fileEntryMenuItem}>
            Télécharger
          </MenuItem>
          <MenuItem eventKey='delete' className={style.fileEntryMenuItem}>
            Supprimer
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

function Info({ intl, entry }) {
  const date = entry.date;
  const user = entry.user;
  return (
    <div data-ignore-root-close className={style.fileEntryInfoWrapper}>
      <div className={style.fileEntryInfoIcon}>
        {getFileIcon(`${entry.type}|48`)}
      </div>
      <div className={style.fileEntryInfo}>
        <strong title={entry.name} className={style.fileEntryInfoDisplayName}>
          {entry.name}
        </strong>
        <div className={style.fileEntryInfoDate}>
          <time
            title={intl.formatDate(date)}
            dateTime={new Date(date).toISOString()}
          >
            {intl.formatRelative(date)}
          </time>
        </div>
        <div className={style.fileEntryInfoUser}>
          <Link
            to={
              PATH_SETTINGS_BASE +
              '/' +
              PATH_SETTINGS_BUSINESS_USER +
              '/' +
              user.id
            }
          >
            {user.displayName}
          </Link>
        </div>
      </div>
    </div>
  );
}

function File({ entry, onClick }) {
  return (
    <div onClick={onClick} className={style.fileEntry}>
      <div className={style.fileEntryIcon}>
        {getFileIcon(entry.type)}
      </div>
      <div title={entry.name} className={style.fileEntryDisplayName}>
        {entry.name}
      </div>
    </div>
  );
}

const getFileIcon = memoizeStringOnly(function getFileIcon(info) {
  const [type, size = ICON_SIZE] = info.split(/\|/);

  if (type.startsWith('image/')) {
    return <FileIcon.Image size={size} />;
  }

  if (type.startsWith('audio/')) {
    return <FileIcon.Audio size={size} />;
  }

  if (type.startsWith('video/')) {
    return <FileIcon.Video size={size} />;
  }

  if (type.includes('excel')) {
    return <FileIcon.Excel size={size} />;
  }

  if (type.includes('word')) {
    return <FileIcon.Word size={size} />;
  }

  if (type.includes('pdf')) {
    return <FileIcon.Pdf size={size} />;
  }

  if (type.includes('zip')) {
    return <FileIcon.Archive size={size} />;
  }

  if (type.startsWith('text/')) {
    return <FileIcon.Text size={size} />;
  }

  return <FileIcon.Unknown size={size} />;
});

export default compose(injectIntl, withApollo)(FileEntry);
