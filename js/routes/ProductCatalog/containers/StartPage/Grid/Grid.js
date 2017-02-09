import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { isServer } from 'vars';

import { createSelector } from 'utils/reselect';

import ScrollSpy from 'components/ScrollSpy';

import DataLoader from '../../../utils/DataLoader';

import Scroll from 'Scroll';

import GridHeader from './GridHeader';
import GridItem from './GridItem';
import Empty from './EmptyGrid';

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

class Grid extends React.Component {
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

  componentDidMount() {
    setImmediate(() => {
      Scroll.setTop(ReactDOM.findDOMNode(this), 53);
    });
  }

  onSelect(key, event) {
    event.stopPropagation();

    const { setSelection, addToSelection } = this.props.actions;
    if (event.shiftKey) {
      addToSelection(key);
    } else {
      setSelection(key);
    }
  }
  onNext(activeIndex, event) {
    const { setSelection } = this.props.actions;
    setSelection(activeIndex + 1);
  }
  onPrevious(activeIndex, event) {
    const { setSelection } = this.props.actions;
    setSelection(activeIndex - 1);
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
        spy ? <ScrollSpy.Spying fetchMore={fetchMore} offset={NAVBAR_HEIGHT} disabled={disabled} onSpy={this.onSpy}/> : <ScrollSpy.Idle disabled={disabled}/>
      );
    }

    return (
      <Dropdown
        defaultOpen
        onSelect={this.onSelect}
        onNext={this.onNext}
        onPrevious={this.onPrevious}
        className={style.body}
      >
        <GridHeader/>
        <Dropdown.Menu className={style.gridItemsWrapper}>
          {items.map((item, index) => (
            <MenuItem
              key={item.id}
              componentClass={GridItem}
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

Grid.propTypes = {
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
)(Grid);

