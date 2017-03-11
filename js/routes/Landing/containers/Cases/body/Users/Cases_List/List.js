import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { isServer } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import DataLoader from 'routes/Landing/DataLoader';

import ListHeader from './ListHeader';
import ListItem from './ListItem';
import Empty from './EmptyList';

import LoadingItem from './LoadingItem';

import Dropdown from 'components/bootstrap/Dropdown';

import MenuItem from 'components/bootstrap/MenuItem';

import { toggleSelection } from 'redux/reducers/cases/actions';

import style from 'routes/Landing/styles';

import selector from './selector';

const NAVBAR_HEIGHT = 70;

class List extends React.Component {
  constructor(props) {
    super(props);

    this.onSpy   = this.onSpy.bind(this);
    this.onItem  = this.onItem.bind(this);

    this.state = {
      spy       : !props.loading,
      fetchMore : props.docs.length < props.length,
    };
  }

  onItem(id) {
    this.props.actions.toggleSelection(id);
  }

  onSpy() {
    this.setState({
      spy       : false,
      fetchMore : true,
    }, () => {
      this.props.loadMoreDocs();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cursor !== nextProps.cursor && nextProps.loading === false) {
      this.setState({
        spy       : true,
        fetchMore : nextProps.docs.length < nextProps.length,
      });
    }
  }

  render() {
    const { cursor, loading, length, docs : items, isReady } = this.props;

    if (loading === false && length === 0) {
      return (
        <Empty/>
      );
    }

    if (typeof loading === 'undefined' || loading === true) {
      return (
        <div className={style.docsContainer}>
          <Dropdown
            defaultOpen
            className={style.listContainer}
          >
            <ListHeader/>
            <Dropdown.Menu className={style.listItemsWrapper}>
              {Array.from(new Array(15)).map(() => <LoadingItem/>)}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }

    let scrollSpy = null;
    if (isReady && !isServer) {
      const { spy, fetchMore } = this.state;
      const disabled = (items.length < 30);
      scrollSpy = (
        spy ? <ScrollSpy.Spying bubbles fetchMore={fetchMore} offset={NAVBAR_HEIGHT} disabled={disabled} onSpy={this.onSpy}/> : <ScrollSpy.Idle Loading={LoadingItem} disabled={disabled}/>
      );
    }

    return (
      <div className={style.docsContainer}>
        <Dropdown
          defaultOpen
          className={style.listContainer}
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
      </div>
    );
  }
}

List.propTypes = {
  length : T.number,
  loading : T.bool.isRequired,
  docs : T.arrayOf(T.shape({
    id : T.string.isRequired,
  })).isRequired,
  loadMoreDocs : T.func.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      toggleSelection,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
  DataLoader.docs,
)(List);

