import React, { PropTypes as T } from 'react';
// import { placements } from './placements';
// import Trigger from 'components/react-components/Trigger';

// import './Tooltip.scss';

// export default class Tooltip extends React.Component {
//   static propTypes = {
//     trigger              : T.any,
//     children             : T.any,
//     defaultVisible       : T.bool,
//     visible              : T.bool,
//     placement            : T.string,
//     transitionName       : T.string,
//     animation            : T.any,
//     onVisibleChange      : T.func,
//     afterVisibleChange   : T.func,
//     overlay              : T.oneOfType([T.node, T.func]).isRequired,
//     overlayStyle         : T.object,
//     overlayClassName     : T.string,
//     prefixCls            : T.string,
//     mouseEnterDelay      : T.number,
//     mouseLeaveDelay      : T.number,
//     getTooltipContainer  : T.func,
//     destroyTooltipOnHide : T.bool,
//     align                : T.object,
//     arrowContent         : T.any,
//   };
//
//   static defaultProps = {
//     prefixCls: 'tp-tooltip',
//     mouseEnterDelay: 0,
//     destroyTooltipOnHide: false,
//     mouseLeaveDelay: 0.1,
//     align: {},
//     placement: 'right',
//     trigger: ['hover'],
//     arrowContent: null,
//     animation: 'fade',
//   };
//
//   getPopupElement = () => {
//     const { arrowContent, overlay, prefixCls } = this.props;
//     return ([
//       <div className={`${prefixCls}-arrow`} key='arrow'>
//         {arrowContent}
//       </div>,
//       <div className={`${prefixCls}-inner`} key='content'>
//         {typeof overlay === 'function' ? overlay() : overlay}
//       </div>,
//     ]);
//   };
//
//   getPopupDomNode = () => {
//     return this.refs.trigger.getPopupDomNode();
//   };
//
//   render() {
//     const {
//       overlayClassName, trigger,
//       mouseEnterDelay, mouseLeaveDelay,
//       overlayStyle, prefixCls,
//       children, onVisibleChange,
//       transitionName, animation,
//       placement, align,
//       destroyTooltipOnHide,
//       defaultVisible, getTooltipContainer,
//       ...restProps
//     } = this.props;
//     const extraProps = { ...restProps };
//     if ('visible' in this.props) {
//       extraProps.popupVisible = this.props.visible;
//     }
//     return (<Trigger
//       popupClassName={overlayClassName}
//       ref='trigger'
//       prefixCls={prefixCls}
//       popup={this.getPopupElement}
//       action={trigger}
//       builtinPlacements={placements}
//       popupPlacement={placement}
//       popupAlign={align}
//       getPopupContainer={getTooltipContainer}
//       onPopupVisibleChange={onVisibleChange}
//       popupTransitionName={transitionName}
//       popupAnimation={animation}
//       defaultPopupVisible={defaultVisible}
//       destroyPopupOnHide={destroyTooltipOnHide}
//       mouseLeaveDelay={mouseLeaveDelay}
//       popupStyle={overlayStyle}
//       mouseEnterDelay={mouseEnterDelay}
//       {...extraProps}
//     >
//       {children}
//     </Trigger>);
//   }
// }

export default ({ children }) => React.Children.only(children);

