function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Component } from "react";
import shallowEqual from "fbjs/lib/shallowEqual";
import createStore from "unistore";
import devtools from "unistore/devtools";
import { Provider } from "unistore/react";
import * as Types from "./types";
import * as PointSet from "./point-set";
import * as PointMap from "./point-map";
import * as Matrix from "./matrix";
import Spreadsheet from "./Spreadsheet";
var initialState = {
  selected: PointSet.from([]),
  copied: PointMap.from([]),
  active: null,
  mode: "view",
  cellDimensions: PointMap.from([]),
  lastChanged: null,
  bindings: PointMap.from([])
};

var SpreadsheetStateProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(SpreadsheetStateProvider, _Component);

  function SpreadsheetStateProvider(props) {
    var _this;

    _classCallCheck(this, SpreadsheetStateProvider);

    _this = _possibleConstructorReturn(this, (SpreadsheetStateProvider.__proto__ || Object.getPrototypeOf(SpreadsheetStateProvider)).call(this, props));
    _this.store = void 0;
    _this.unsubscribe = void 0;
    _this.prevState = void 0;

    var state = _objectSpread({}, initialState, {
      data: _this.props.data
    });

    _this.store = process.env.NODE_ENV === "production" ? createStore(state) : devtools(createStore(state));
    _this.prevState = state;
    return _this;
  }

  _createClass(SpreadsheetStateProvider, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this$props = this.props,
          data = _this$props.data,
          rest = _objectWithoutProperties(_this$props, ["data"]);

      var nextData = nextProps.data,
          nextRest = _objectWithoutProperties(nextProps, ["data"]);

      return !shallowEqual(rest, nextRest) || nextData !== this.prevState.data;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props2 = this.props,
          onChange = _this$props2.onChange,
          onModeChange = _this$props2.onModeChange,
          onSelect = _this$props2.onSelect,
          onActivate = _this$props2.onActivate;
      this.unsubscribe = this.store.subscribe(function (state) {
        var prevState = _this2.prevState;

        if (state.data !== prevState.data && state.data !== _this2.props.data) {
          onChange(state.data);
        }

        if (state.mode !== prevState.mode) {
          onModeChange(state.mode);
        }

        if (state.selected !== prevState.selected) {
          onSelect(PointSet.toArray(state.selected));
        }

        if (state.active !== prevState.active && state.active) {
          onActivate(state.active);
        }

        _this2.prevState = state;
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.data !== this.prevState.data) {
        this.store.setState({
          data: this.props.data
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          data = _this$props3.data,
          rest = _objectWithoutProperties(_this$props3, ["data"]);

      return React.createElement(Provider, {
        store: this.store
      }, React.createElement(Spreadsheet, Object.assign({}, rest, {
        store: this.store
      })));
    }
  }]);

  return SpreadsheetStateProvider;
}(Component);

SpreadsheetStateProvider.defaultProps = {
  onChange: function onChange() {},
  onModeChange: function onModeChange() {},
  onSelect: function onSelect() {},
  onActivate: function onActivate() {},
  onCellCommit: function onCellCommit() {}
};
export { SpreadsheetStateProvider as default };