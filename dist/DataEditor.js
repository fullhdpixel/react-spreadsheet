function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { PureComponent } from "react";
import * as Types from "./types";
import { moveCursorToEnd } from "./util";

var DataEditor =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(DataEditor, _PureComponent);

  function DataEditor() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, DataEditor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = DataEditor.__proto__ || Object.getPrototypeOf(DataEditor)).call.apply(_ref, [this].concat(args))), _this.input = void 0, _this.handleChange = function (e) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          cell = _this$props.cell;
      onChange(_objectSpread({}, cell, {
        value: e.target.value
      }));
    }, _this.handleInput = function (input) {
      _this.input = input;
    }, _temp));
  }

  _createClass(DataEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.input) {
        moveCursorToEnd(this.input);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          getValue = _this$props2.getValue,
          column = _this$props2.column,
          row = _this$props2.row,
          cell = _this$props2.cell;
      var value = getValue({
        column: column,
        row: row,
        data: cell
      }) || "";
      return React.createElement("div", {
        className: "DataEditor"
      }, React.createElement("input", {
        ref: this.handleInput,
        type: "text",
        onChange: this.handleChange,
        value: value,
        autoFocus: true
      }));
    }
  }]);

  return DataEditor;
}(PureComponent);

DataEditor.defaultProps = {
  value: ""
};
export { DataEditor as default };