import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { SERVER } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import ListHeader from './ListHeader';
import ListItem from './ListItem';
import Empty from './EmptyList';

import LoadingItem from './LoadingItem';

import Dropdown from 'components/bootstrap/Dropdown';

import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Landing/styles';

import selector from './selector';

class List extends React.Component {

  constructor(props) {
    super(props);

    this.onSpy   = this.onSpy.bind(this);
    this.onItem  = this.onItem.bind(this);

    this.state = {
      items     : props.docs,
      spy       : !props.loading,
      fetchMore : props.docs.length < props.length,
    };
  }

  onItem(id) {
  }

  onSpy() {
    this.setState({
      spy       : false,
      fetchMore : true,
    }, () => {
      this.props.loadMore();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cursor !== nextProps.cursor && nextProps.loading === false) {
      this.setState({
        spy       : true,
        fetchMore : nextProps.cursor < this.props.length,
      });
    }

    if (nextProps.loading === false) {
      this.setState({
        items: nextProps.docs,
      });
    }
  }

  render() {
    const { cursor, loading, length, isReady } = this.props;
    const { items } = this.state;

    if (loading === false && length === 0) {
      return (
        <Empty/>
      );
    }

    if ((typeof loading === 'undefined' || loading === true) && items.length === 0) {
      return (
        <div style={{ paddingLeft: 0 }} className={style.docsContainer}>
          <Dropdown
            defaultOpen
            className={style.listContainer}
          >
            <ListHeader/>
            <Dropdown.Menu className={style.listItemsWrapper}>
              {/* {Array.from(new Array(5)).map(() => <LoadingItem/>)} */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }

    let scrollSpy = null;
    if (isReady && !SERVER) {
      const { spy, fetchMore } = this.state;
      const disabled = (length < 30);
      scrollSpy = (
        spy ? <ScrollSpy.Spying
          bubbles
          manual
          loadMoreLabel='Plus des dossiers'
          fetchMore={fetchMore}
          disabled={disabled}
          onSpy={this.onSpy}
        /> : <ScrollSpy.Idle
          Loading={LoadingItem}
          doneLabel='Dossiers chargés'
          done={cursor === length}
        />
      );
    }

    return (
      <div style={{ paddingLeft: 0 }} className={style.docsContainer}>
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

List.defaultProps = {
  docs : [],
  loading : false,
  length: 0,
};

List.propTypes = {
  length : T.number,
  loading : T.bool.isRequired,
  docs : T.arrayOf(T.shape({
    id : T.string.isRequired,
  })).isRequired,
  loadMore : T.func.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(List);

