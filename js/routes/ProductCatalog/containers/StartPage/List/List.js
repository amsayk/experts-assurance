import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import { isServer } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import DataLoader from '../../../utils/DataLoader';

import ListHeader from './ListHeader';
import ListItem from './ListItem';
import Empty from './EmptyList';

import {
  PATH_PRODUCT_CATALOG_BASE,
  PATH_PRODUCT_CATALOG_PRODUCT_BASE,
} from 'vars';

import Dropdown from 'components/bootstrap/Dropdown';

import MenuItem from 'components/bootstrap/MenuItem';

import { setSelection, addToSelection } from 'redux/reducers/catalog/actions';

import style from '../../../ProductCatalog.scss';

const appSelector = state => state.get('app');

const selector = createSelector(
  appSelector,
  (app) => ({ isReady : app.isReady }),
);

const NAVBAR_HEIGHT = 61;
const HEADER_HEIGHT = 49;

class List extends React.Component {
  static contextTypes = {
    // store: T.shape({
    //   getState : T.func.isRequired,
    // }).isRequired,
  };

  // get selection() {
  //   return this.context.store.getState().getIn(['catalog', 'selection', 'keys']);
  // }

  constructor(props) {
    super(props);

    this.onSelect   = this.onSelect.bind(this);
    this.onNext     = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onSpy      = this.onSpy.bind(this);
    this.onItem     = this.onItem.bind(this);
    this.onClose    = this.onClose.bind(this);

    this.state = {
      spy       : !props.loading,
      fetchMore : props.products.length < props.length,
    };
  }

  onItem(id) {
    this.props.router.push({
      pathname : PATH_PRODUCT_CATALOG_BASE + '/' + PATH_PRODUCT_CATALOG_PRODUCT_BASE + '/' + id,
    });
  }

  onClose() {
    this.props.actions.setSelection([]);
  }

  onSpy() {
    this.setState({
      spy       : false,
      fetchMore : true,
    }, () => {
      this.props.loadMoreProducts();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cursor !== nextProps.cursor && nextProps.loading === false) {
      this.setState({
        spy       : true,
        fetchMore : nextProps.products.length < nextProps.length,
      });
    }
  }

  onSelect(key, event) {
    const { setSelection, addToSelection } = this.props.actions;
    if (event.shiftKey) {
      addToSelection(key);
    } else {
      setSelection(key);
    }

    // const { setSelection } = this.props.actions;
    // if (event.shiftKey) {
    //   const selection = this.selection;
    //   if (selection.isEmpty()) {
    //     setSelection(key);
    //   } else if (selection.size === 1) {
    //     const selectedKey = selection.first();
    //     const keys = [];
    //     for (let i = Math.min(key, selectedKey), l = Math.max(key, selectedKey); i <= l; i++) {
    //       keys.push(i)
    //     }
    //
    //     setSelection(keys);
    //   } else {
    //     const keys = [];
    //
    //     const min = selection.min();
    //     const max = selection.max();
    //
    //     if (key > max) {
    //       { // add previous consecutive keys
    //         let i = max;
    //         while (selection.includes(i)) {
    //           keys.push(i);
    //           i = i - 1;
    //         }
    //       }
    //
    //       { // add in-between keys
    //         let i = key;
    //         while (max < i) {
    //           keys.push(i);
    //           i = i - 1;
    //         }
    //       }
    //
    //     } else {
    //       { // add next consecutive keys
    //         let i = min;
    //         while (selection.includes(i)) {
    //           keys.push(i);
    //           i = i + 1;
    //         }
    //       }
    //
    //       { // add in-between keys
    //         let i = key;
    //         while (min > i) {
    //           keys.push(i);
    //           i = i + 1;
    //         }
    //       }
    //     }
    //
    //     setSelection(keys);
    //   }
    // } else {
    //   setSelection(key);
    // }
  }

  onNext(activeIndex, event) {
    const { setSelection } = this.props.actions;
    setSelection(activeIndex + 1);

    // const selection = this.selection;
    // const { actions } = this.props;
    //
    // if (event.shiftKey) {
    //   if (selection.includes(activeIndex + 1)) {
    //     actions.setSelection(selection.remove(activeIndex).toJS());
    //   } else {
    //     const keys = [];
    //
    //     // add previous consecutive keys
    //     let i = activeIndex;
    //     while (selection.includes(i)) {
    //       keys.push(i);
    //       i = i - 1;
    //     }
    //
    //     keys.push(activeIndex + 1); // Add current key
    //     actions.setSelection(keys);
    //   }
    // } else {
    //   actions.setSelection(activeIndex + 1);
    // }
  }
  onPrevious(activeIndex, event) {
    const { setSelection } = this.props.actions;
    setSelection(activeIndex - 1);

    // const selection = this.selection;
    // const { actions } = this.props;
    //
    // if (event.shiftKey) {
    //   if (selection.includes(activeIndex - 1)) {
    //     actions.setSelection(selection.remove(activeIndex).toJS());
    //   } else {
    //     const keys = [];
    //
    //     // add next consecutive keys
    //     let i = activeIndex;
    //     while (selection.includes(i)) {
    //       keys.push(i);
    //       i = i + 1;
    //     }
    //
    //     keys.push(activeIndex - 1); // Add current key
    //     actions.setSelection(keys);
    //   }
    // } else {
    //   actions.setSelection(activeIndex - 1);
    // }
  }
  render() {
    const { loading, length, products : items, isReady } = this.props;

    if (loading === false && length === 0) {
      return (
        <Empty/>
      );
    }

    let scrollSpy = null;
    if (isReady && !isServer) {
      const { spy, fetchMore } = this.state;
      const disabled = (items.length < 30);
      scrollSpy = (
        spy ? <ScrollSpy.Spying fetchMore={fetchMore} offset={NAVBAR_HEIGHT + HEADER_HEIGHT} disabled={disabled} onSpy={this.onSpy}/> : <ScrollSpy.Idle disabled={disabled}/>
      );
    }

    return (
      <Dropdown
        defaultOpen
        onNext={this.onNext}
        onPrevious={this.onPrevious}
        onSelect={this.onSelect}
        className={style.body}
      >
        <ListHeader/>
        <Dropdown.Menu className={style.listItemsWrapper}>
          {items.map((item, index) => (
            <MenuItem
              key={item.id}
              componentClass={ListItem}
              eventKey={index}
              index={index}
              item={item}
              onItem={this.onItem}
            />
          ))}
          {scrollSpy}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

List.propTypes = {
  length : T.number,
  loading : T.bool.isRequired,
  products : T.arrayOf(T.shape({
    id : T.string.isRequired,
  })).isRequired,
  label : T.string,
  loadMoreProducts : T.func.isRequired,
  router     : T.shape({
    push : T.func.isRequired,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      setSelection,
      addToSelection,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRouter,
  Connect,
  DataLoader.products,
)(List);

