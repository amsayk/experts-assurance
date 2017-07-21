import React from 'react';

import style from 'containers/Importation/styles';

import Zoom from 'components/transitions/Zoom';

import raf from 'utils/requestAnimationFrame';

import { CloseIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

const styles = {
  body : {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 2.25rem',
  },
  wrapper : {
    position: 'relative',
    zIndex: 1077,
    height: '100%',
    width: '100%',
    overflowY: 'auto',
  },
  confirmToastr : {},
};

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);

    this.state = {
      show : props.show,
    };
  }
  onTransitionEnd() {
    if (this.applyTransitionEnd) {
      this.applyTransitionEnd();
      this.applyTransitionEnd = null;
    }
  }

  onClose() {
    // const { dirty } = this.props;
    const self = this;

    function doClose() {
      self.applyTransitionEnd = () => {
        setTimeout(() => {
          raf(() => {
            self.props.closePortal();
          })
        }, 0);
      };

      self.setState({
        show : false,
      });
    }

    // if (dirty) {
    //   toastr.confirm(CONFIRM_MSG, {
    //     onOk : doClose,
    //   });
    // } else {
    doClose();
    // }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.show === true && nextProps.show === false) {
      this.setState({
        show : false,
      });
    } else if (this.state.show === false && nextProps.show === true) {
      this.setState({
        show : true,
      });
    }
  }

  render() {
    const { children, ...props } = this.props;

    return (
      <Zoom onTransitionEnd={this.onTransitionEnd} in={this.state.show} timeout={75} transitionAppear>
        <div className={style.dialogWrapper}>
          <div className={style.dialogMask}></div>
          <div style={styles.wrapper}>
            <div className={style.dialogInner}>
              <div className={style.dialog}>
                {this.state.show && children ? React.cloneElement(children, props) : <div/>}
              </div>
            </div>
            {/* <Actions /> */}
          </div>
          <div className={style.dialogClose}>
            <Button onClick={this.onClose} className={style.dialogCloseButton} role='button'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CloseIcon size={24}/>
              </div>
            </Button>
          </div>
        </div>
      </Zoom>
    );

  }
}

