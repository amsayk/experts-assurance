import React from 'react';
import T from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withApollo } from 'react-apollo';

import { startClosingDoc } from 'redux/reducers/app/actions';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import CloseDoc from './CloseDoc';

import raf from 'utils/requestAnimationFrame';

import style from 'routes/Landing/styles';

import { MoreHorizIcon } from 'components/icons/MaterialIcons';

import MUTATION from './isDocValid.query.graphql';

class DocMenu extends React.Component {
  static contextTypes = {
    snackbar: T.shape({
      show: T.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onCloseDoc = this.onCloseDoc.bind(this);
  }
  onSelect(key) {
    if (key === 'close') {
      this.onCloseDoc();
    }
    if (key === 'cancel') {
      this.props.onCancel();
    }
    if (key === 'delete') {
      this.props.onDelete();
    }
  }
  onCloseDoc() {
    const self = this;
    const { doc, busy } = self.props;

    const startTime = Date.now();
    busy(true, async function() {
      const { data: { isDocValid } } = await self.props.client.query({
        query: MUTATION,
        fetchPolicy: 'network-only',
        variables: { id: doc.id },
      });

      const duration = Date.now() - startTime;
      setTimeout(function() {
        busy(false, function() {
          if (isDocValid) {
            self.props.actions.startClosingDoc();
          } else {
            self.context.snackbar.show({
              message: (
                <b>Des pièces jointes manquent. Clôturer de toute façon?</b>
              ),
              duration: 5 * 1000,
              // closeable : true,
              action: {
                title: 'Clôturer',
                click: function() {
                  this.dismiss();
                  setTimeout(() => {
                    raf(() => {
                      self.props.actions.startClosingDoc();
                    });
                  }, 0);
                },
              },
            });
          }
        });
      }, duration >= 1500 ? 0 : 1500 - duration);
    });
  }
  render() {
    const { user, doc } = this.props;

    if (doc.state === 'CLOSED' || doc.state === 'CANCELED') {
      return null;
    }

    return (
      <Dropdown pullRight onSelect={this.onSelect}>
        <Dropdown.Toggle className={style.docMenuAction}>
          <MoreHorizIcon size={32} />
        </Dropdown.Toggle>
        <Dropdown.Menu className={style.docMenu}>
          <MenuItem eventKey='close'>
            <CloseDoc doc={doc} />
            Clôturer
          </MenuItem>
          <MenuItem eventKey='cancel'>Annuler</MenuItem>
          {user.isAdmin || user.isManager(doc)
            ? [
                <MenuItem divider />,
                <MenuItem eventKey='delete'>Supprimer</MenuItem>,
              ]
            : null}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ startClosingDoc }, dispatch) };
}

const Connect = connect(null, mapDispatchToProps);

export default compose(withApollo, Connect)(DocMenu);
