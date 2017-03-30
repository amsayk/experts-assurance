import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
  PATH_CASES
} from 'vars';

import {
  UnknownIcon,
  WatchIcon,
  DoneIcon,
  CanceledIcon,
} from 'components/icons/MaterialIcons';

import ProfilePic from 'components/Profile/ProfilePic';

import withCurrentUser from 'utils/withCurrentUser';

import DataLoader from 'routes/Landing/DataLoader';

import emptyObject from 'emptyObject';

import { injectIntl } from 'react-intl';

import selector from './selector';

import style from 'routes/Landing/styles';

import cx from 'classnames';

const NAVBAR_HEIGHT = 70;
const TOOLBAR_HEIGHT = 41;

const TOP = NAVBAR_HEIGHT + TOOLBAR_HEIGHT + 20;

const NOTIFICATION_HEIGHT = 45;

const styles = {
  notificationOpen : {
    top : TOP + NOTIFICATION_HEIGHT,
  },
};

class RecentDocs extends React.Component {
  render() {
    const { intl, notificationOpen, isReady, currentUser, loading, docs : items, extrapolation : periods } = this.props;

    if (loading) {
      return null;
    }

    const groups = periods.map(({ id, title, to, from }) => {
      const acts = items.filter((item) => to
        ? to > item.date && item.date >= from
        : item.date >= from
      );

      return acts.length ? (
        <div className={style.feedGroup} key={id}>
          <h5 className={style.feedGroupTitle}>{title}</h5>
          <section className={style.feedGroupItems}>
            {acts.map((entry) => (
              <Entry
                key={entry.id}
                intl={intl}
                doc={entry}
              />
            ))}
          </section>
        </div>
      ) : <div className={style.feedGroup} key={id}></div>;
    });

    return (
      <div className={style.recentDocs} style={notificationOpen ? styles.notificationOpen : emptyObject}>
        <h2>Dossiers récents
        </h2>
        <div className={style.feed}>
          {groups}
        </div>
        <div className={style.allDocsLink}>
          <Link to={PATH_CASES}>
            Afficher tous les dossiers
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  withCurrentUser,
  Connect,
  DataLoader.recentDocs,
)(RecentDocs);

function getState(state, stateText, icon) {
  return [
    // <span className={cx(style[state], style.docStateToggle)}>
    //   {icon}
    // </span>,
    <span className={style.text} style={{
      // textTransform: 'uppercase',
      marginRight: 5,
      border: '1px solid #000',
      borderRadius: '15%',
      padding: '1px 4px',
      marginLeft: 5,
    }}>
    {stateText}
  </span>,
  ];
}

const STATES = {
  PENDING  : getState('PENDING',  'En cours',  <UnknownIcon   size={12}/>),
  OPEN     : getState('OPEN',     'Validé',    <WatchIcon     size={12}/>),
  CLOSED   : getState('CLOSED',   'Clos',      <DoneIcon      size={12}/>),
  CANCELED : getState('CANCELED', 'Annulé',    <CanceledIcon  size={12}/>),
};

const TYPE = 'RECENT_DOCUMENT';

function Entry({ intl, doc }, { currentUser }) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>

      <div className={style.profilePic}>
        <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + doc.user.id}>
          <ProfilePic
            user={doc.user}
            size={24}
          />
        </Link>
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            Dossier <b>{doc.refNo}</b>
          </Link>
        </div>
        {/* <div className={style.desc}> */}
          {/*   {STATES[doc.state]} */}
          {/* </div> */}
        <div className={style.desc}>
          <h6 style={{ marginBottom: 3, marginTop: 3 }}>{doc.vehicle.model}, {doc.vehicle.plateNumber}</h6>
        </div>
        <div className={style.info}>
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + doc.user.id}>
            {doc.user.displayName}
          </Link> ·{' '}
          <time title={intl.formatDate(doc.date)} dateTime={new Date(new Date(doc.date)).toISOString()}>
            {intl.formatRelative(new Date(doc.date))}
          </time>
        </div>
      </div>
    </article>
  );
}

Entry.contextTypes = {
  currentUser : T.object.isRequired,
};

