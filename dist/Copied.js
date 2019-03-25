import React from "react";
import { connect } from "unistore/react";
import * as PointSet from "./point-set";
import * as PointMap from "./point-map";
import FloatingRect, { mapStateToProps } from "./FloatingRect";

var Copied = function Copied(props) {
  return React.createElement(FloatingRect, Object.assign({}, props, {
    className: "copied"
  }));
};

export default connect(function (state) {
  return mapStateToProps(state.hasPasted ? PointSet.from([]) : PointMap.map(function () {
    return true;
  }, state.copied))(state);
})(Copied);