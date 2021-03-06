import React from 'react';
import T from 'prop-types';

import cx from 'classnames';

import style from 'routes/Landing/styles';

export default class Nav extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onFiles = props.onChange.bind(this, 'timeline.files');
    this.onEvents = props.onChange.bind(this, 'timeline.events');
    this.onObservations = props.onChange.bind(this, 'timeline.comments');
  }
  render() {
    const { id, intl, selectedNavItem, onChange } = this.props;
    return (
      <nav className={style.navgroup}>
        <ul className={style.nav}>
          <li
            className={cx(
              selectedNavItem === 'timeline.files' && style.navSelected,
            )}
          >
            <a onClick={this.onFiles}>
              <h2>Fichiers</h2>
            </a>
          </li>

          <li
            className={cx(
              selectedNavItem === 'timeline.events' && style.navSelected,
            )}
          >
            <a onClick={this.onEvents}>
              <h2>Événements</h2>
            </a>
          </li>

          <li
            className={cx(
              selectedNavItem === 'timeline.comments' && style.navSelected,
            )}
          >
            <a onClick={this.onObservations}>
              <h2>Observations</h2>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

Nav.propTypes = {
  selectedNavItem: T.oneOf([]).isRequired,
};
