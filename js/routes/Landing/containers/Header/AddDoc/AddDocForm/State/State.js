import React from 'react'
import { compose } from 'redux';

import Switch from 'components/Switch';

import style from 'routes/Landing/styles';

const styles = {
  root : {
    display: 'flex',
    width: '30%',
    justifyContent: 'space-between',
    marginBottom: 35
  },
};

class State extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    const { input } = this.props;
    input.onChange(value);
  }

  render() {
    const { input, meta } = this.props;

    return (
      <section style={styles.root}>
        <div>
          <h6>
            En cours?
          </h6>
        </div>
        <div>
          <Switch
            {...input}
            onValueChange={this.onChange}
          />
        </div>
      </section>
    );
  }
}

export default compose(
)(State);

