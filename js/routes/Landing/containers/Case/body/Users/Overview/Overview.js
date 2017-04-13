import React from 'react'

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import Button from 'components/bootstrap/Button';

import ClientLine from './ClientLine';
import ManagerLine from './ManagerLine';
import AgentLine from './AgentLine';
import StateLine from './StateLine';
// import RefLine from './RefLine';
// import VehicleLine from './VehicleLine';
import LastActivityLine from './LastActivityLine';
import DTValidationLine from './DTValidation';
import DTSinisterLine from './DTSinister';
// import DTMissionLine from './DTMission';

import {
  UndoIcon,
  TrashIcon,
} from 'components/icons/MaterialIcons';

class Overview extends React.Component {
  render() {
    const { intl, user, doc, loading } = this.props;
    return (
      <div className={cx(style.overview, loading ? undefined : (doc.deletion && style.deletedDoc))}>
        <div className={cx(style.overviewContent, style.card)}>

          <div className={style.docTitle}>
            <h6 className={style.h6}>
              {loading ? null : `Dossier ${doc.refNo}`}
            </h6>
            <h4 className={style.h4}>
              {loading ? null : `${doc.vehicle.model}, ${doc.vehicle.plateNumber}`}
            </h4>
            <div className={style.deleteOrRestoreDocAction}>
              {loading ? null : <Button className={style.deleteOrRestoreDocButton} role='button'>
                {doc.deletion
                    ? <UndoIcon size={32}/>
                    : <TrashIcon size={32}/>}
              </Button>}
            </div>
          </div>

          <div className={style.docContent}>
            {/* <RefLine */}
              {/*   loading={loading} */}
              {/*   doc={doc} */}
              {/* /> */}
            <StateLine
              loading={loading}
              doc={doc}
              user={user}
            />
            {/* <VehicleLine */}
              {/*   loading={loading} */}
              {/*   doc={doc} */}
              {/* /> */}
            {user.isAdmin ? <ManagerLine
              loading={loading}
              doc={doc}
            /> : null}
            <ClientLine
              label='Assureur'
              loading={loading}
              doc={doc}
            />
            <AgentLine
              loading={loading}
              doc={doc}
            />
            <DTValidationLine
              loading={loading}
              doc={doc}
            />
            <DTSinisterLine
              loading={loading}
              doc={doc}
            />
            {/* <DTMissionLine */}
              {/*   loading={loading} */}
              {/*   doc={doc} */}
              {/* /> */}
            <LastActivityLine
              loading={loading}
              doc={doc}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(null, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.doc,
)(Overview);

