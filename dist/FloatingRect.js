function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import * as PointMap from "./point-map";
import * as PointSet from "./point-set";
import classnames from "classnames";
import "./FloatingRect.css";

var FloatingRect = function FloatingRect(_ref) {
  var width = _ref.width,
      height = _ref.height,
      top = _ref.top,
      left = _ref.left,
      className = _ref.className,
      hidden = _ref.hidden;
  return React.createElement("div", {
    className: classnames("FloatingRect", {
      hidden: hidden
    }, className),
    style: {
      width: width,
      height: height,
      top: top,
      left: left
    }
  });
};

export var mapStateToProps = function mapStateToProps(cells) {
  return function (state) {
    var dimensions = PointSet.reduce(function (acc, point) {
      var isOnEdge = PointSet.onEdge(cells, point);
      var dimensions = PointMap.get(point, state.cellDimensions);

      if (dimensions) {
        return {
          width: isOnEdge.top ? acc.width + dimensions.width : acc.width,
          height: isOnEdge.left ? acc.height + dimensions.height : acc.height,
          left: isOnEdge.left && isOnEdge.top ? dimensions.left : acc.left,
          top: isOnEdge.left && isOnEdge.top ? dimensions.top : acc.top
        };
      }

      return acc;
    }, cells, {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    });
    return _objectSpread({}, dimensions, {
      hidden: PointSet.size(cells) <= 1
    });
  };
};
export default FloatingRect;