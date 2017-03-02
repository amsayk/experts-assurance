import React, { PropTypes as T } from 'react';
import { compose } from 'redux';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

class PageInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cursor : props.cursor,
      length : props.length,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cursor !== nextProps.cursor || this.state.length !== nextProps.length) {
      this.setState({
        length : nextProps.length,
        cursor : nextProps.cursor,
      })
    }
  }

  render() {
    const { length, cursor } = this.state;

    if (length === 0) {
      return null;
    }

    return (
      <div className={style.pageInfo}>
        {cursor} sur {length} utilisateurs
      </div>
    );
  }
}

PageInfo.propTypes = {
  actions : T.shape({
  }),
  intl    : intlShape.isRequired,
  cursor  : T.number.isRequired,
  length  : T.number.isRequired,
};

export default compose(
  injectIntl,
)(PageInfo);

