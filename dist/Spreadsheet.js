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
import devtools from "unistore/devtools";
import { connect } from "unistore/react";
import { Parser as FormulaParser, columnIndexToLabel } from "hot-formula-parser";
import * as Types from "./types";
import Table from "./Table";
import Row from "./Row";
import { Cell, enhance as enhanceCell } from "./Cell";
import DataViewer from "./DataViewer";
import DataEditor from "./DataEditor";
import ActiveCell from "./ActiveCell";
import Selected from "./Selected";
import Copied from "./Copied";
import { getBindingsForCell } from "./bindings";
import { range, writeTextToClipboard, resolveFalsyValues } from "./util";
import * as PointSet from "./point-set";
import * as Matrix from "./matrix";
import * as Actions from "./actions";
import "./Spreadsheet.css";
import { DroppableHeaderColumn, ClearColumn } from "./StyledComponents";

var getValue = function getValue(_ref) {
  var data = _ref.data;
  return data ? data.value : null;
};

var ColumnIndicator = function ColumnIndicator(_ref2) {
  var column = _ref2.column,
      label = _ref2.label;
  return label !== undefined ? React.createElement("th", null, label) : React.createElement("th", null, columnIndexToLabel(column));
};

var RowIndicator = function RowIndicator(_ref3) {
  var row = _ref3.row;
  return React.createElement("th", null, row + 1);
};

var Spreadsheet =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Spreadsheet, _PureComponent);

  function Spreadsheet() {
    var _ref4;

    var _temp, _this;

    _classCallCheck(this, Spreadsheet);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref4 = Spreadsheet.__proto__ || Object.getPrototypeOf(Spreadsheet)).call.apply(_ref4, [this].concat(args))), _this.formulaParser = new FormulaParser(), _this.clip = function () {
      var _this$props = _this.props,
          store = _this$props.store,
          getValue = _this$props.getValue;

      var _store$getState = store.getState(),
          data = _store$getState.data,
          selected = _store$getState.selected;

      var startPoint = PointSet.min(selected);
      var endPoint = PointSet.max(selected);
      var slicedMatrix = Matrix.slice(startPoint, endPoint, data);
      var valueMatrix = Matrix.map(function (value, point) {
        // Slice makes non-existing cells undefined, empty cells are classically
        // translated to an empty string in join()
        if (value === undefined) {
          return "";
        }

        return getValue(_objectSpread({}, point, {
          data: value
        }));
      }, slicedMatrix);
      writeTextToClipboard(Matrix.join(valueMatrix));
    }, _this.handleKeyDown = function (event) {
      var _this$props2 = _this.props,
          store = _this$props2.store,
          onKeyDown = _this$props2.onKeyDown; // Only disable default behavior if an handler exist

      if (Actions.getKeyDownHandler(store.getState(), event)) {
        event.nativeEvent.preventDefault();
      }

      onKeyDown(event);
    }, _this.handleMouseUp = function () {
      _this.props.onDragEnd();

      document.removeEventListener("mouseup", _this.handleMouseUp);
    }, _this.handleMouseMove = function (event) {
      if (!_this.props.store.getState().dragging && event.buttons === 1) {
        _this.props.onDragStart();

        document.addEventListener("mouseup", _this.handleMouseUp);
      }
    }, _this.root = void 0, _this.handleRoot = function (root) {
      _this.root = root;
    }, _temp));
  }

  _createClass(Spreadsheet, [{
    key: "isFocused",
    value: function isFocused() {
      var _document = document,
          activeElement = _document.activeElement;
      return this.root ? this.root === activeElement || this.root.contains(activeElement) : false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props3 = this.props,
          copy = _this$props3.copy,
          cut = _this$props3.cut,
          paste = _this$props3.paste,
          store = _this$props3.store;
      document.addEventListener("copy", function (event) {
        if (_this2.isFocused()) {
          event.preventDefault();
          event.stopPropagation();

          _this2.clip();

          copy();
        }
      });
      document.addEventListener("cut", function (event) {
        if (_this2.isFocused()) {
          event.preventDefault();
          event.stopPropagation();

          _this2.clip();

          cut();
        }
      });
      document.addEventListener("paste", function (event) {
        if (_this2.isFocused()) {
          event.preventDefault();
          event.stopPropagation();
          paste();
        }
      });
      this.formulaParser.on("callCellValue", function (cellCoord, done) {
        var value;
        /** @todo More sound error, or at least document */

        try {
          var cell = Matrix.get(cellCoord.row.index, cellCoord.column.index, store.getState().data);
          value = getValue({
            data: cell
          });
        } catch (error) {
          console.error(error);
        } finally {
          done(value);
        }
      });
      this.formulaParser.on("callRangeValue", function (startCellCoord, endCellCoord, done) {
        var startPoint = {
          row: startCellCoord.row.index,
          column: startCellCoord.column.index
        };
        var endPoint = {
          row: endCellCoord.row.index,
          column: endCellCoord.column.index
        };
        var values = Matrix.toArray(Matrix.slice(startPoint, endPoint, store.getState().data)).map(function (cell) {
          return getValue({
            data: cell
          });
        });
        done(values);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props4 = this.props,
          Table = _this$props4.Table,
          Row = _this$props4.Row,
          Cell = _this$props4.Cell,
          droppableHeaderLabels = _this$props4.droppableHeaderLabels,
          _onDrop = _this$props4.onDrop,
          _onDragOver = _this$props4.onDragOver,
          isDragging = _this$props4.isDragging,
          droppableStyle = _this$props4.droppableStyle,
          clearColumn = _this$props4.clearColumn,
          clearHeaderIconClass = _this$props4.clearHeaderIconClass,
          onDragHeaderStart = _this$props4.onDragHeaderStart,
          onDragHeaderEnd = _this$props4.onDragHeaderEnd,
          columnLabels = _this$props4.columnLabels,
          DataViewer = _this$props4.DataViewer,
          getValue = _this$props4.getValue,
          rows = _this$props4.rows,
          columns = _this$props4.columns,
          onKeyPress = _this$props4.onKeyPress,
          onCellCommit = _this$props4.onCellCommit,
          getBindingsForCell = _this$props4.getBindingsForCell,
          hideColumnIndicators = _this$props4.hideColumnIndicators,
          hideRowIndicators = _this$props4.hideRowIndicators;
      return React.createElement("div", {
        ref: this.handleRoot,
        className: "Spreadsheet",
        onKeyPress: onKeyPress,
        onKeyDown: this.handleKeyDown,
        onMouseMove: this.handleMouseMove
      }, React.createElement(Table, null, React.createElement("tr", null, !hideRowIndicators && !hideColumnIndicators && droppableHeaderLabels && React.createElement("th", null), droppableHeaderLabels && droppableHeaderLabels.map(function (column, index) {
        return React.createElement(DroppableHeaderColumn, {
          draggable: true,
          droppableStyle: isDragging && droppableStyle,
          key: index,
          className: isDragging && 'draggable',
          onDragOver: function onDragOver(e) {
            return _onDragOver(e, index);
          },
          onDrop: function onDrop(e) {
            return _onDrop(e, index);
          }
        }, column, column && clearHeaderIconClass ? React.createElement("i", {
          className: clearHeaderIconClass,
          onClick: function onClick(e) {
            return clearColumn(e, index);
          }
        }) : null, column && !clearHeaderIconClass ? React.createElement(ClearColumn, {
          onClick: function onClick(e) {
            return clearColumn(e, index);
          }
        }) : null);
      })), React.createElement("tr", null, !hideRowIndicators && !hideColumnIndicators && React.createElement("th", null), !hideColumnIndicators && range(columns).map(function (columnNumber) {
        return columnLabels ? React.createElement(ColumnIndicator, {
          key: columnNumber,
          column: columnNumber,
          label: columnNumber in columnLabels ? columnLabels[columnNumber] : null
        }) : React.createElement(ColumnIndicator, {
          key: columnNumber,
          column: columnNumber
        });
      })), range(rows).map(function (rowNumber) {
        return React.createElement(Row, {
          key: rowNumber
        }, !hideRowIndicators && React.createElement(RowIndicator, {
          key: rowNumber,
          row: rowNumber
        }), range(columns).map(function (columnNumber) {
          return React.createElement(Cell, {
            key: columnNumber,
            row: rowNumber,
            column: columnNumber,
            DataViewer: DataViewer,
            getValue: getValue,
            formulaParser: _this3.formulaParser
          });
        }));
      })), React.createElement(ActiveCell, {
        onCellCommit: onCellCommit,
        DataEditor: DataEditor,
        getValue: getValue,
        getBindingsForCell: getBindingsForCell
      }), React.createElement(Selected, null), React.createElement(Copied, null));
    }
  }]);

  return Spreadsheet;
}(PureComponent);

Spreadsheet.defaultProps = {
  Table: Table,
  Row: Row,

  /** @todo enhance incoming Cell prop */
  Cell: enhanceCell(Cell),
  DataViewer: DataViewer,
  DataEditor: DataEditor,
  getValue: getValue,
  getBindingsForCell: getBindingsForCell
};

var mapStateToProps = function mapStateToProps(_ref5) {
  var data = _ref5.data;
  return Matrix.getSize(data);
};

export default connect(mapStateToProps, {
  copy: Actions.copy,
  cut: Actions.cut,
  paste: Actions.paste,
  onKeyDown: Actions.keyDown,
  onKeyPress: Actions.keyPress,
  onDragStart: Actions.dragStart,
  onDragEnd: Actions.dragEnd
})(Spreadsheet);