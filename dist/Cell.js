function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { PureComponent } from "react";
import classnames from "classnames";
import { connect } from "unistore/react";
import * as PointSet from "./point-set";
import * as PointMap from "./point-map";
import * as Matrix from "./matrix";
import * as Types from "./types";
import * as Actions from "./actions";
import { isActive, getOffsetRect } from "./util";
export var Cell =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Cell, _PureComponent);

  function Cell() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, Cell);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = Cell.__proto__ || Object.getPrototypeOf(Cell)).call.apply(_ref, [this].concat(args))), _this.root = void 0, _this.handleRoot = function (root) {
      _this.root = root;
    }, _this.handleMouseDown = function (e) {
      var _this$props = _this.props,
          row = _this$props.row,
          column = _this$props.column,
          setCellDimensions = _this$props.setCellDimensions,
          select = _this$props.select,
          activate = _this$props.activate,
          mode = _this$props.mode;

      if (mode === "view") {
        setCellDimensions({
          row: row,
          column: column
        }, getOffsetRect(e.currentTarget));

        if (e.shiftKey) {
          select({
            row: row,
            column: column
          });
          return;
        }

        activate({
          row: row,
          column: column
        });
      }
    }, _this.handleMouseOver = function (e) {
      var _this$props2 = _this.props,
          row = _this$props2.row,
          column = _this$props2.column,
          dragging = _this$props2.dragging,
          setCellDimensions = _this$props2.setCellDimensions,
          select = _this$props2.select;

      if (dragging) {
        setCellDimensions({
          row: row,
          column: column
        }, getOffsetRect(e.currentTarget));
        select({
          row: row,
          column: column
        });
      }
    }, _temp));
  }

  _createClass(Cell, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props3 = this.props,
          row = _this$props3.row,
          column = _this$props3.column,
          active = _this$props3.active,
          selected = _this$props3.selected,
          mode = _this$props3.mode,
          setCellDimensions = _this$props3.setCellDimensions;

      if (selected && this.root) {
        setCellDimensions({
          row: row,
          column: column
        }, getOffsetRect(this.root));
      }

      if (this.root && active && mode === "view") {
        this.root.focus();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          row = _this$props4.row,
          column = _this$props4.column,
          getValue = _this$props4.getValue,
          formulaParser = _this$props4.formulaParser;
      var _this$props5 = this.props,
          DataViewer = _this$props5.DataViewer,
          data = _this$props5.data;

      if (data && data.DataViewer) {
        var _data = data;
        DataViewer = _data.DataViewer;
        data = _objectWithoutProperties(_data, ["DataViewer"]);
      }

      return React.createElement("td", {
        ref: this.handleRoot,
        className: classnames({
          readonly: data && data.readOnly
        }),
        onMouseOver: this.handleMouseOver,
        onMouseDown: this.handleMouseDown,
        tabIndex: 0
      }, React.createElement(DataViewer, {
        row: row,
        column: column,
        cell: data,
        getValue: getValue,
        formulaParser: formulaParser
      }));
    }
  }]);

  return Cell;
}(PureComponent);

function mapStateToProps(_ref2, _ref3) {
  var data = _ref2.data,
      active = _ref2.active,
      selected = _ref2.selected,
      copied = _ref2.copied,
      hasPasted = _ref2.hasPasted,
      mode = _ref2.mode,
      dragging = _ref2.dragging,
      lastChanged = _ref2.lastChanged,
      bindings = _ref2.bindings;
  var column = _ref3.column,
      row = _ref3.row;
  var point = {
    row: row,
    column: column
  };
  var cellIsActive = isActive(active, point);
  var cellBindings = PointMap.get(point, bindings);
  return {
    active: cellIsActive,
    selected: PointSet.has(selected, point),
    copied: PointMap.has(point, copied),
    mode: cellIsActive ? mode : "view",
    data: Matrix.get(row, column, data),
    dragging: dragging,

    /** @todo refactor */
    _bindingChanged: cellBindings && lastChanged && PointSet.has(cellBindings, lastChanged) ? {} : null
  };
}

export var enhance = connect(mapStateToProps, function () {
  return {
    select: Actions.select,
    activate: Actions.activate,
    setCellDimensions: Actions.setCellDimensions
  };
});