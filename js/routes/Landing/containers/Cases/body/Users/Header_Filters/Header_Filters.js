import React from 'react'

import style from 'routes/Landing/styles';

import cx from 'classnames';

import ClientFilter from '../../filters/ClientFilter';
import InsurerFilter from '../../filters/InsurerFilter';
import StateFilter from '../../filters/DocStateFilter';
import Actions from '../../Actions';

export default class Header_Filters extends React.Component {
  render() {
    return (
      <div className={style.docsHeader}>

        <div className={style.filters}>
          <h6 className={cx(style.filterGroup, style.intro)}>Filtrer:</h6>
          <ClientFilter/>
          <InsurerFilter/>
          <StateFilter/>
          <Actions user={this.props.user}/>
        </div>

      </div>
    );
  }
}

