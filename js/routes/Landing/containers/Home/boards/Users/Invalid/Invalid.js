import React from 'react';
import T from 'prop-types';
import { compose, bindActionCreators } from 'redux';

import moment from 'moment';

import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import Button from 'components/bootstrap/Button';

import { toggle, setCategory } from 'redux/reducers/dashboard/actions';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import ActivityIndicator from 'components/ActivityIndicator';

import { DownloadIcon } from 'components/icons/MaterialIcons';

import CategorySelector from './CategorySelector';

import List from './Invalid_List';

import DATA_QUERY from './getInvalidDocsToExcel.query.graphql';

import FileSaver from 'file-saver';

import pick from 'lodash.pick';

class Invalid extends React.Component {
  static contextTypes = {
    client: T.object.isRequired,
    snackbar: T.shape({
      show: T.func.isRequired,
    }).isRequired,
  };

  constructor() {
    super();

    this.onDownload = this.onDownload.bind(this);
    this._handleToggle = this._handleToggle.bind(this);

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
        const { category, sortConfig } = this.props;
        const { client, snackbar } = this.context;

        const variables = {
          durationInDays: -1,
          category: category,
          sortConfig: pick(sortConfig, ['key', 'direction']),
        };

        const {
          data: { getInvalidDocsToExcel: { data, error } },
        } = await client.query({
          query: DATA_QUERY,
          fetchPolicy: 'network-only',
          variables,
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

          const title = `Dossiers avec pièces manquantes - ${moment
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

  _handleToggle(e) {
    if (e.target === this.header) {
      this.props.actions.toggle();
    }
  }
  render() {
    const { sortConfig, isOpen, category, data, loadMore, actions } = this.props;
    const summary =
      data.length && data.cursor
        ? <span
            style={{
              color: 'rgba(112, 112, 112, 0.85)',
              fontSize: 13,
              verticalAlign: 'middle',
            }}
          >
            {' '}· {data.length} dossiers
          </span>
        : null;
    return (
      <div
        className={cx(
          style.board,
          isOpen && style.dashboardOpen,
          style.boardPending,
        )}
      >
        <header
          onClick={this._handleToggle}
          ref={header => (this.header = header)}
          className={style.boardHeader}
        >
          <div
            style={{
              paddingLeft: 10,
            }}
            className={cx(style['OPEN'], style.boardIcon)}
          >
            #
          </div>
          <h5 className={style.boardTitle}>
            Dossiers avec pièces manquantes {summary}
          </h5>
          <div className={style.ctrls}>
            <div className={style.icon}>
              {data.loading ? <ActivityIndicator size='small' /> : null}
            </div>
            <div className={cx(style.icon, style.download)}>
              <Button
                disabled={this.state.downloading}
                onClick={this.onDownload}
                className={style.downloadButton}
                role='button'
              >
                <DownloadIcon size={18} />
              </Button>
            </div>
            <div className={style.icon}>
              <CategorySelector
                category={category}
                onCategory={actions.setCategory}
              />
            </div>
          </div>
        </header>
        {isOpen
          ? <div className={style.boardContent}>
              <List sortConfig={sortConfig} loadMore={loadMore} {...data} />
            </div>
          : null}
      </div>
    );
  }
}

Invalid.defaultProps = {
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
    actions: bindActionCreators(
      {
        toggle: (...args) => toggle('invalid', ...args),
        setCategory,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect, DataLoader.invalidDocs)(Invalid);
