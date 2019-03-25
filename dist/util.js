function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import * as Types from "./types";
import clipboard from "clipboard-polyfill";
export var moveCursorToEnd = function moveCursorToEnd(el) {
  el.selectionStart = el.selectionEnd = el.value.length;
};
/**
 * Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end. A step of -1 is used if a negative start is specified without an end or step. If end is not specified, it's set to start with start then set to 0.
 * @param end
 * @param start
 * @param step
 */

export function range(end) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var array = [];

  if (Math.sign(end - start) === -1) {
    for (var element = start; element > end; element -= step) {
      array.push(element);
    }

    return array;
  }

  for (var _element = start; _element < end; _element += step) {
    array.push(_element);
  }

  return array;
}
export function updateData(data, cellDescriptor) {
  var row = data[cellDescriptor.row];

  var nextData = _toConsumableArray(data);

  var nextRow = row ? _toConsumableArray(row) : [];
  nextRow[cellDescriptor.column] = cellDescriptor.data;
  nextData[cellDescriptor.row] = nextRow;
  return nextData;
}
export function setCell(state, cell) {
  return updateData(state.data, _objectSpread({}, state.active, {
    data: cell
  }));
}
export function isActive(active, _ref) {
  var row = _ref.row,
      column = _ref.column;
  return Boolean(active && column === active.column && row === active.row);
}
export var getOffsetRect = function getOffsetRect(element) {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop
  };
};
/**
 * @todo better error management
 */

/**
 * Wraps Clipboard.writeText() with permission check if necessary
 * @param string - The string to be written to the clipboard.
 */

export var writeTextToClipboard = function writeTextToClipboard(string) {
  var write = function write() {
    return clipboard.writeText(string);
  };

  if (navigator.permissions) {
    navigator.permissions.query({
      name: "clipboard-read"
    }).then(function (readClipboardStatus) {
      if (readClipboardStatus.state) {
        write();
      }
    });
  } else {
    write();
  }
};