function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "unistore/react";
import * as Matrix from "./matrix";
import * as PointMap from "./point-map";
import * as Actions from "./actions";
import * as Types from "./types";

var ActiveCell =
/*#__PURE__*/
function (_Component) {
  _inherits(ActiveCell, _Component);

  function ActiveCell() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, ActiveCell);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = ActiveCell.__proto__ || Object.getPrototypeOf(ActiveCell)).call.apply(_ref, [this].concat(args))), _this.state = {
      cellBeforeUpdate: null
    }, _this.handleChange = function (cell) {
      var _this$props = _this.props,
          setData = _this$props.setData,
          getBindingsForCell = _this$props.getBindingsForCell;
      var bindings = getBindingsForCell(cell);
      setData(cell, bindings);
    }, _this.handleCellCommit = function (before, after) {
      var onCellCommit = _this.props.onCellCommit;
      onCellCommit(before, after);
    }, _temp));
  }

  _createClass(ActiveCell, [{
    key: "componentDidUpdate",
    // NOTE: Currently all logics here belongs to onCellCommit event
    value: function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          cell = _this$props2.cell,
          mode = _this$props2.mode,
          onCellCommit = _this$props2.onCellCommit;

      if (cell || cell === undefined) {
        if (prevProps.mode === "view" && mode === "edit") {
          this.setState({
            cellBeforeUpdate: prevProps.cell
          });
        } else if (prevProps.mode === "edit" && prevProps.mode !== this.props.mode && prevProps.cell && prevProps.cell !== this.state.cellBeforeUpdate) {
          onCellCommit(this.state.cellBeforeUpdate, prevProps.cell);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var DataEditor = this.props.DataEditor;
      var _this$props3 = this.props,
          getValue = _this$props3.getValue,
          row = _this$props3.row,
          column = _this$props3.column,
          cell = _this$props3.cell,
          width = _this$props3.width,
          height = _this$props3.height,
          top = _this$props3.top,
          left = _this$props3.left,
          hidden = _this$props3.hidden,
          mode = _this$props3.mode,
          edit = _this$props3.edit;
      DataEditor = cell && cell.DataEditor || DataEditor;
      return hidden ? null : React.createElement("div", {
        className: classnames("ActiveCell", mode),
        style: {
          width: width,
          height: height,
          top: top,
          left: left
        },
        onClick: mode === "view" ? edit : undefined
      }, mode === "edit" && React.createElement(DataEditor, {
        row: row,
        column: column,
        cell: cell,
        onChange: this.handleChange,
        getValue: getValue
      }));
    }
  }]);

  return ActiveCell;
}(Component);

var EmptyDimensions = {
  width: 0,
  height: 0,
  top: 0,
  left: 0
};

var mapStateToProps = function mapStateToProps(state) {
  if (!state.active || !PointMap.has(state.active, state.cellDimensions)) {
    return {
      hidden: true
    };
  }

  var dimensions = PointMap.get(state.active, state.cellDimensions) || EmptyDimensions;
  return _objectSpread({
    hidden: false
  }, state.active, {
    // $FlowFixMe
    cell: Matrix.get(state.active.row, state.active.column, state.data),
    width: dimensions.width,
    height: dimensions.height,
    top: dimensions.top,
    left: dimensions.left,
    mode: state.mode
  });
};

export default connect(mapStateToProps, {
  setData: Actions.setData,
  edit: Actions.edit
})(ActiveCell);