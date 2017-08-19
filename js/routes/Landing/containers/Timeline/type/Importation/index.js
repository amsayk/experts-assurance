import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import { loadImportation, show } from 'redux/reducers/importation/actions';

import { ImportIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

import cx from 'classnames';

const TYPE = 'IMPORTATION';

const ICON_WRAPPER_STYLE = {
  color: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(33, 150, 243)',
  userSelect: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'bolder',
  fontStretch: 'normal',
  fontSize: 13,
  lineHeight: 'normal',
  fontFamily: 'Helvetica, Arial, sans-serif',
  borderRadius: '50%',
  textTransform: 'uppercase',
  height: 24,
  width: 24,
};

function Importation(
  { intl, doc, user, now: timestamp, metadata, importation, actions },
  { currentUser },
) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>
      <div style={ICON_WRAPPER_STYLE} className={style.profilePic}>
        <ImportIcon size={18} />
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Button
            bsStyle='link'
            onClick={actions.loadImportation.bind(null, importation)}
            role='button'
            className={style.importationLink}
          >
            Importation <b>{intl.formatDate(timestamp)}</b>
          </Button>
        </div>
        <div className={style.desc}>
          {importation.total} dossiers importés
        </div>
        <div className={style.info}>
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
          </Link>{' '}
          ·{' '}
          <time
            title={intl.formatDate(timestamp)}
            dateTime={new Date(timestamp).toISOString()}
          >
            {intl.formatRelative(new Date(timestamp))}
          </time>
        </div>
      </div>
    </article>
  );
}

Importation.contextTypes = {
  currentUser: T.object.isRequired,
};

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        loadImportation: (...args) => [loadImportation(...args), show()],
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Importation);
