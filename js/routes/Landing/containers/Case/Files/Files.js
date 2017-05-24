import React, { PropTypes as T } from 'react'

import { compose } from 'redux';
import { connect } from 'react-redux';

import emptyObject from 'emptyObject';

import { injectIntl } from 'react-intl';

import DataLoader from 'routes/Landing/DataLoader';

import selector from './selector';

import cx from 'classnames';

import style from 'routes/Landing/styles';

import Nav from 'routes/Landing/components/Nav';

import FileEntry from './FileEntry';
import NewFileEntry from './NewFileEntry';

import CATEGORIES from 'file-categories';

const NAVBAR_HEIGHT = 70;
const TOOLBAR_HEIGHT = 41;

const TOP = NAVBAR_HEIGHT + TOOLBAR_HEIGHT + 20;

const NOTIFICATION_HEIGHT = 45;

const styles = {
  notificationOpen : {
    top : TOP + NOTIFICATION_HEIGHT,
  },
};

class Files extends React.PureComponent {
  static defaultProps = {
    loading : false,
    files  : [],
  };

  constructor(props) {
    super(props);


    this.state = {
    };
  }


  componentWillReceiveProps(nextProps) {

  }
  render() {
    const {
      doc,
      intl,
      id,
      notificationOpen,
      loading,
      cursor,
      files : items,
    } = this.props;

    // if (loading) {
    //   return null;
    // }

    const categories = CATEGORIES.map(({ slug, displayName : title }) => {
      const files = items.filter((f) => slug === f.category).map((entry, index) => (
        <FileEntry
          key={index}
          intl={intl}
          entry={entry}
        />
      ));

      files.sort((a, b) => b.date - a.date);

      const height = (files.length + 1) * 26;

      files.push(
        <NewFileEntry
          key='new'
          id={id}
          category={slug}
          height={height}
        />
      );

      return (
        <div className={style.feedGroup} key={slug}>
          <h5 className={style.feedGroupTitle}>{title}</h5>
          <section style={{ minHeight: Math.max(height, 50) }} className={style.filesFeedGroupItems}>
            {files}
          </section>
        </div>
      );
    });

    return (
      <div className={style.timeline} style={notificationOpen ? styles.notificationOpen : emptyObject}>
        <Nav
          intl={intl}
          onChange={this.props.onNav}
          selectedNavItem='timeline.files'
        />
        <div className={style.feed}>
          {categories}
        </div>
      </div>
    );
  }

}

Files.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.docFiles,
)(Files);

