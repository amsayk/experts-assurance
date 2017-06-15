import React from 'react'

import style from 'routes/Search/styles';

import cx from 'classnames';

import State from './fields/State';
import Manager from './fields/Manager';
import Client from './fields/Client';
import Agent from './fields/Agent';
import DTSinister from './fields/DTSinister';
// import DTValidation from './fields/DTValidation';
import DTClosure from './fields/DTClosure';
// import Q from './fields/Q';
import LastModified from './fields/LastModified';

import VehicleManufacturer from './fields/VehicleManufacturer';
import VehicleModel from './fields/VehicleModel';

import DTMission from './fields/DTMission';
import Company from './fields/Company';

import Actions from './Actions';

export default class AdvancedSearch extends React.Component {
  render() {
    const { className, qClassName, role, search, actions } = this.props;
    return (
      <div className={cx(style.advancedSearch, qClassName)}>
        <h6 className={style.advancedSearch_intro}>Recherche avancée</h6>

        {/* render state row */}
        {/* render closer if state='CLOSED' || state='CANCELED' */}
        {/* render validator if state='OPEN' */}
        <State state={search.state} onState={actions.onState}/>
        <DTMission
          range={search.missionRange ? search.missionRange.toJS() : {}}
          onRange={actions.onDTMissionRange}/>
        <DTSinister
          range={search.range ? search.range.toJS() : {}}
          onRange={actions.onRange}/>
        {/* <DTValidation */}
          {/*   state={search.state} */}
          {/*   range={search.validationRange ? search.validationRange.toJS() : {}} */}
          {/*   onRange={actions.onValidationRange} */}
          {/* /> */}
        <DTClosure
          state={search.state}
          range={search.closureRange ? search.closureRange.toJS() : {}}
          onRange={actions.onClosureRange} />
        <LastModified
          date={search.lastModified}
          onDate={actions.onLastModified}/>

            <div style={{marginTop: 15}}></div>

        {/* render divider */}
        {/* <div className={style.advancedSearch_divider}/> */}

        <h6 className={style.advancedSearch_intro}>Véhicule</h6>

        <VehicleManufacturer
          manufacturer={search.vehicleManufacturer}
          onVehicle={actions.onVehicleManufacturer}/>

        <VehicleModel
          model={search.vehicleModel}
          onVehicle={actions.onVehicleModel}/>

        {/* render divider */}
        {/* <div className={style.advancedSearch_divider}/> */}

            <div style={{marginTop: 15}}></div>

        <h6 className={style.advancedSearch_intro}>Individuels/Sociétés</h6>

        {/* render users ---- */}
        <Company
         company={search.company}
         onCompany={actions.onCompany}/>
        <Manager
          manager={search.manager}
          onManager={actions.onManager}/>
        <Client
          client={search.client}
          onClient={actions.onClient}/>
        <Agent
          agent={search.agent}
          onAgent={actions.onAgent}/>

        {/* render divider */}
        {/* <div className={style.advancedSearch_divider}/> */}

        {/* render dates ---- */}
        {/* <Q q={search.q} onQ={actions.onQ}/> */}
        <Actions actions={actions}/>
      </div>
    );
  }
}

