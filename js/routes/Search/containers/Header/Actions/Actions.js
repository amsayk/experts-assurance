import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';

import pick from 'lodash.pick';

import ActivityIndicator from 'components/ActivityIndicator';

import moment from 'moment';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import { DownloadIcon } from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Search/styles';

import { injectIntl, intlShape } from 'react-intl';

import FileSaver from 'file-saver';

import DATA_QUERY from './esQueryDocsToExcel.query.graphql';

function rangeToDate(range) {
  if (range) {
    return {
      from: momentToDate(range.from || range.get('from')),
      to: momentToDate(range.to || range.get('to')),
    };
  } else {
    return null;
  }
}

function momentToDate(date) {
  if (date) {
    return +moment.utc(date);
  } else {
    return null;
  }
}

const tooltipAlign = {
  offset: [0, -4],
};

class Actions extends React.PureComponent {
  static contextTypes = {
    store: T.object.isRequired,
    client: T.object.isRequired,
    snackbar: T.shape({
      show: T.func.isRequired,
    }).isRequired,
  };

  constructor() {
    super();

    this.onDownload = this.onDownload.bind(this);

    this.state = {
      downloading: false,
    };
  }
  onDownload() {
    if (this.state.downloading) {
      return;
    }
    this.setState(
      {
        downloading: true,
      },
      async () => {
        const { client, store, snackbar } = this.context;

        const search = store.getState().get('docSearch');

        const {
          data: { esQueryDocsToExcel: { data, error } },
        } = await client.query({
          query: DATA_QUERY,
          fetchPolicy: 'network-only',
          variables: {
            query: {
              q: search.q,

              company: search.company,
              client: search.client,
              manager: search.manager,
              agent: search.agent,

              vehicleModel: search.vehicleModel,
              vehicleManufacturer: search.vehicleManufacturer,

              validator: search.validator,
              closer: search.closer,
              user: search.user,

              missionRange: rangeToDate(search.missionRange),
              range: rangeToDate(search.range),
              // validationRange     : rangeToDate(search.validationRange),
              closureRange: momentToDate(search.closureRange),

              state: search.state,

              lastModified: momentToDate(search.lastModified),

              sortConfig: search.sortConfig
                ? pick(search.sortConfig, ['key', 'direction'])
                : null,
            },
          },
        });

        if (error) {
          snackbar.show({
            type: 'error',
            message: 'Erreur de téléchargement.',
          });
        } else {
          function base64ToBlob(data, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            const byteString = atob(data);

            // separate out the mime component
            const mimeString =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

            // write the bytes of the string to an ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            const bb = new Blob([ab], { type: mimeString });
            return bb;
          }

          const title = `Dossiers-recherche-${moment
            .utc()
            .format('DD-MM-YY')}.xlsx`;

          FileSaver.saveAs(base64ToBlob(data), title);
        }

        this.setState({
          downloading: false,
        });
      },
    );
  }

  render() {
    const { length } = this.props;
    if (length === 0) {
      return null;
    }

    return (
      <div className={style.actions}>
        <div key='download' className={style.download}>
          <Tooltip
            align={tooltipAlign}
            placement='bottom'
            overlay={'Télécharger'}
          >
            <Button
              disabled={this.state.downloading}
              className={style.downloadButton}
              onClick={this.onDownload}
              role='button'
            >
              {this.state.downloading
                ? <ActivityIndicator size={28} />
                : <DownloadIcon size={32} />}
            </Button>
          </Tooltip>
        </div>
        <div key='divider' className={style.divider} />
      </div>
    );
  }
}

Actions.propTypes = {
  intl: intlShape.isRequired,
  length: T.number.isRequired,
};

export default compose(injectIntl)(Actions);
