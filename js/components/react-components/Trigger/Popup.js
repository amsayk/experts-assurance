import React from 'react';
import T from 'prop-types';
import ReactDOM from 'react-dom';
import Align from 'components/react-components/Align';
import Transition from '../utils/Transition';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';

export default class Popup extends React.Component {
  static propTypes = {
    visible: T.bool,
    style: T.object,
    getClassNameFromAlign: T.func,
    onAlign: T.func,
    getRootDomNode: T.func,
    onMouseEnter: T.func,
    align: T.any,
    destroyPopupOnHide: T.bool,
    className: T.string,
    prefixCls: T.string,
    onMouseLeave: T.func,
  };

  componentDidMount() {
    this.rootNode = this.getPopupDomNode();
  }

  onAlign = (popupDomNode, align) => {
    const props = this.props;
    const alignClassName = props.getClassNameFromAlign(props.align);
    const currentAlignClassName = props.getClassNameFromAlign(align);
    if (alignClassName !== currentAlignClassName) {
      this.currentAlignClassName = currentAlignClassName;
      popupDomNode.className = this.getClassName(currentAlignClassName);
    }
    props.onAlign(popupDomNode, align);
  };

  getPopupDomNode = () => {
    return ReactDOM.findDOMNode(this.refs.popup);
  };

  getTarget = () => {
    return this.props.getRootDomNode();
  };

  getMaskTransitionName = () => {
    const props = this.props;
    let transitionName = props.maskTransitionName;
    const animation = props.maskAnimation;
    if (!transitionName && animation) {
      transitionName = `${props.prefixCls}-${animation}`;
    }
    return transitionName;
  };

  getTransitionName = () => {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-${props.animation}`;
    }
    return transitionName;
  };

  getClassName = currentAlignClassName => {
    return `${this.props.prefixCls} ${this.props
      .className} ${currentAlignClassName}`;
  };

  getPopupElement = () => {
    const props = this.props;
    const { align, style, visible, prefixCls, destroyPopupOnHide } = props;
    const className = this.getClassName(
      this.currentAlignClassName || props.getClassNameFromAlign(align),
    );
    const hiddenClassName = `${prefixCls}-hidden`;
    if (!visible) {
      this.currentAlignClassName = null;
    }
    const newStyle = {
      ...style,
      ...this.getZIndexStyle(),
    };
    const popupInnerProps = {
      className,
      prefixCls,
      ref: 'popup',
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      style: newStyle,
    };
    if (destroyPopupOnHide) {
      return (
        <Transition
          transitionAppear
          transitionName={this.getTransitionName()}
          in={visible}
        >
          {visible
            ? <Align
                target={this.getTarget}
                key='popup'
                childrenProps={{ className: 'className' }}
                ref={this.saveAlign}
                monitorWindowResize
                align={align}
                onAlign={this.onAlign}
              >
                <PopupInner visible {...popupInnerProps}>
                  {props.children}
                </PopupInner>
              </Align>
            : null}
        </Transition>
      );
    }
    return (
      <Transition
        transitionAppear
        transitionName={this.getTransitionName()}
        in={visible}
      >
        <Align
          target={this.getTarget}
          key='popup'
          ref={this.saveAlign}
          monitorWindowResize
          xVisible={visible}
          childrenProps={{ visible: 'xVisible', className: 'className' }}
          disabled={!visible}
          align={align}
          onAlign={this.onAlign}
        >
          <PopupInner hiddenClassName={hiddenClassName} {...popupInnerProps}>
            {props.children}
          </PopupInner>
        </Align>
      </Transition>
    );
  };

  getZIndexStyle = () => {
    const style = {};
    const props = this.props;
    if (props.zIndex !== undefined) {
      style.zIndex = props.zIndex;
    }
    return style;
  };

  getMaskElement = () => {
    const props = this.props;
    let maskElement;
    if (props.mask) {
      const maskTransition = this.getMaskTransitionName();
      maskElement = (
        <LazyRenderBox
          style={this.getZIndexStyle()}
          key='mask'
          className={`${props.prefixCls}-mask`}
          hiddenClassName={`${props.prefixCls}-mask-hidden`}
          visible={props.visible}
        />
      );
      if (maskTransition) {
        maskElement = (
          <Transition
            key='mask'
            transitionAppear
            transitionName={maskTransition}
            in={props.visible}
          >
            {maskElement}
          </Transition>
        );
      }
    }
    return maskElement;
  };

  saveAlign = align => {
    this.alignInstance = align;
  };

  render() {
    return (
      <div>
        {this.getMaskElement()}
        {this.getPopupElement()}
      </div>
    );
  }
}
