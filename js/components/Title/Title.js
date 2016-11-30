import React, {PropTypes} from 'react';

import Helmet from 'react-helmet';

export default class extends React.Component {
  static displayName = 'Title';

  static contextTypes = {
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.title !== nextProps.title;
  }

  render() {
    const { title } = this.props;
    return (
      <Helmet title={title}/>
    );
  }
}

