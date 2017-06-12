import React, { PropTypes as T } from 'react';

import { SERVER } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import DataLoader from 'routes/Landing/DataLoader';

import ListHeader from './ListHeader';
import ListItem from './ListItem';

import LoadingItem from './LoadingItem';

import Dropdown from 'components/bootstrap/Dropdown';

import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Search/styles';

const NAVBAR_HEIGHT = 60;

class List extends React.Component {
  constructor(props) {
    super(props);

    this.onSpy   = this.onSpy.bind(this);
    this.onItem  = this.onItem.bind(this);

    this.state = {
      spy       : !props.loading,
      fetchMore : props.hits.length < props.length,
    };
  }

  onItem(id) {
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
        // spy       : true,
        spy       : nextProps.cursor < nextProps.length,
        fetchMore : nextProps.hits.length < nextProps.length,
      });
    }
  }

  render() {
    const { took, cursor, loading, length, hits : items, isReady } = this.props;

    if (loading === false && length === 0) {
      return (
        <div className={style.docsContainer}>
          <Dropdown
            defaultOpen={false}
            className={style.listContainer}
          >
            <div className={style.summary}>
              Aucun résultat
            </div>
            <br/>
            <Dropdown.Menu className={style.listItemsWrapper}>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }

    if (typeof loading === 'undefined' || loading === true) {
      return (
        <div className={style.docsContainer}>
          <Dropdown
            defaultOpen
            className={style.listContainer}
          >
            <div className={style.summary}>
            </div>
            <br/>
            <ListHeader/>
            <Dropdown.Menu className={style.listItemsWrapper}>
              {Array.from(new Array(15)).map(() => <LoadingItem/>)}
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
        spy ? <ScrollSpy.Spying loadMoreLabel='Plus des dossiers' bubbles fetchMore={fetchMore} offset={NAVBAR_HEIGHT} disabled={disabled} onSpy={this.onSpy}/> : <ScrollSpy.Idle Loading={LoadingItem} done={cursor === length} doneLabel='Dossiers chargés' disabled={disabled}/>
      );
    }

    return (
      <div className={style.docsContainer}>
        <Dropdown
          defaultOpen
          className={style.listContainer}
        >
          <div className={style.summary}>
            {cursor}/{length} dossiers en {took/1000} seconds
          </div>
          <br/>
          <ListHeader/>
          <Dropdown.Menu className={style.listItemsWrapper}>
            {items.map((item, index) => (
              <MenuItem
                key={item._source.id}
                componentClass={ListItem}
                eventKey={item._source.id}
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
  hits : T.arrayOf(T.shape({
    id : T.string.isRequired,
  })).isRequired,
  loadMoreDocs : T.func.isRequired,
};

export default List;

