import React from 'react'
import { compose } from 'redux';

import DataLoader from 'routes/Search/DataLoader';

import Highlighter from 'react-highlight-words';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import compact from 'lodash.compact';

import style from 'routes/Landing/styles';

function intersperse(a, delim) {
  let first = true;
  let ret = [];
  for (const x of a) {
    if (!first) ret.push(delim);
    first = false;
    ret.push(x);
  }
  return ret.join('');
}

function pickerState(Component) {
  return class extends React.Component {
    state = {
      queryString: '',
    };

    constructor() {
      super()

      this.onSearch = this.onSearch.bind(this);
      this.onVehicle = this.onVehicle.bind(this);
    }

    onVehicle(manufacturer) {
      this.props.onVehicle(manufacturer);
      this.setState({
        queryString: '',
      });
    }

    onSearch(e) {
      this.setState({
        queryString : e.target.value,
      })
    }

    render() {
      return (
        <Component
          onSearch={this.onSearch}
          queryString={this.state.queryString}
          {...this.props}
          onVehicle={this.onVehicle}
        />
      )
    }
  }
}

class PickVehicle extends React.Component {

  render() {
    const {
      onInput,
      onSearch,
      queryString,
      loading = false,
      vehicles = [],
      onVehicle,
    } = this.props;

    let content = <li className={style.noResults}>Aucun résultat</li>;
    if (loading) {
      content = queryString ? null : content;
    } else if (vehicles.length > 0) {
      content = vehicles.map(function ({ manufacturer, model }) {
        const fields = compact([
          manufacturer,
          // model,
          // manufacturer
        ]);
        const highlightText = intersperse(fields, ', ');
        return (
          <li className={style.result}>
            <MenuItem onClick={onVehicle.bind(null, manufacturer)} className={style.userLine} role='button'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={style.text}>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[queryString]}
                    textToHighlight={highlightText}
                  />
                </span>
              </div>
            </MenuItem>
          </li>
        );
      });
    }

    return (
      <div className={style.pickUser} style={{}}>
        <div className={style.search}>
          <input
            ref={onInput}
            type='text'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            className={style.input}
            value={queryString}
            onChange={onSearch}
          />
        </div>
        <div className={style.results}>
          <ul>
            {content}
          </ul>
        </div>
      </div>
    );
  }
}

export default compose(
  pickerState,
  DataLoader.searchVehicles,
)(PickVehicle);

