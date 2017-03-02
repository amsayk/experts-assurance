import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { isServer } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import DataLoader from '../../DataLoader';

import Toolbar from '../Toolbar';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import ListHeader from './ListHeader';
import ListItem from './ListItem';
import Empty from './EmptyList';

import Dropdown from 'components/bootstrap/Dropdown';

import MenuItem from 'components/bootstrap/MenuItem';

import { setSelection, addToSelection } from 'redux/reducers/users/actions';

import style from 'routes/Settings/styles';

import selector from './selector';

const NAVBAR_HEIGHT = 61;
const TOOLBAR_HEIGHT = 49;
const HEADER_HEIGHT = 49;

class List extends React.Component {
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
      fetchMore : props.users.length < props.length,
    };
  }

  onItem(id) {
    this.props.router.push({
      pathname : PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + id,
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
      this.props.loadMoreUsers();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cursor !== nextProps.cursor && nextProps.loading === false) {
      this.setState({
        spy       : true,
        fetchMore : nextProps.users.length < nextProps.length,
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
    const { cursor, loading, length, users : items, isReady } = this.props;

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
        spy ? <ScrollSpy.Spying scrollThreshold={0.5} fetchMore={fetchMore} offset={NAVBAR_HEIGHT + TOOLBAR_HEIGHT + HEADER_HEIGHT} disabled={disabled} onSpy={this.onSpy}/> : <ScrollSpy.Idle disabled={disabled}/>
      );
    }

    return (
      <div className={style.usersContainer}>
        <Toolbar cursor={cursor} length={length}/>
        <Dropdown
          defaultOpen
          onNext={this.onNext}
          onPrevious={this.onPrevious}
          onSelect={this.onSelect}
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
  users : T.arrayOf(T.shape({
    id : T.string.isRequired,
  })).isRequired,
  loadMoreUsers : T.func.isRequired,
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
  DataLoader.users,
)(List);

