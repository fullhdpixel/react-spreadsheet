function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Immutable unordered Map like interface of point to value pairs.
 *
 * 
 */
import * as Types from "./types";

/** Sets the value for point in map */
export function set(point, value, map) {
  return _objectSpread({}, map, _defineProperty({}, point.row, _objectSpread({}, map[point.row], _defineProperty({}, point.column, value))));
}
export function unset(_ref, map) {
  var row = _ref.row,
      column = _ref.column;

  if (!(row in map) || !(column in map[row])) {
    return map;
  }

  var _map$String = map[String(row)],
      _ = _map$String[String(column)],
      nextRow = _objectWithoutProperties(_map$String, [String(column)]),
      nextMap = _objectWithoutProperties(map, [String(row)]);

  if (Object.keys(nextRow).length === 0) {
    return nextMap;
  }

  return _objectSpread({}, nextMap, _defineProperty({}, row, nextRow));
}
/** Gets the value for point in map */

export function get(point, map) {
  return map[point.row] && map[point.row][point.column];
}
/** Checks if map has point assigned to value */

export function has(point, map) {
  return point.row in map && point.column in map[point.row];
}
var EMPTY = {};
/** Creates a new PointMap instance from an array-like or iterable object. */

export function from(pairs) {
  return pairs.reduce(function (acc, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        point = _ref3[0],
        value = _ref3[1];

    return set(point, value, acc);
  }, EMPTY);
}
/** Returns the number of elements in a PointMap object. */

export function size(map) {
  var acc = 0;

  var _map_keys = Object.keys(map);

  for (var _i2 = 0; _i2 < _map_keys.length; _i2++) {
    var _row = Number(_map_keys[_i2]);

    var columns = map[_row];
    acc += Object.keys(columns).length;
  }

  return acc;
}
/** Applies a function against an accumulator and each value and point in the map (from left to right) to reduce it to a single value */

export function reduce(func, map, initialValue) {
  var acc = initialValue;

  var _map_keys = Object.keys(map);

  for (var _i3 = 0; _i3 < _map_keys.length; _i3++) {
    var _row2 = Number(_map_keys[_i3]);

    var columns = map[_row2];

    var _columns_keys = Object.keys(columns);

    for (var j = 0; j < _columns_keys.length; j++) {
      var _column = Number(_columns_keys[j]);

      var _value = columns[_column];
      acc = func(acc, _value, {
        row: _row2,
        column: _column
      });
    }
  }

  return acc;
}
/** Creates a new map with the results of calling a provided function on every value in the calling map */

export function map(func, map) {
  return reduce(function (acc, value, point) {
    return set(point, func(value), acc);
  }, map, from([]));
}
/** Returns whether map has any points set to value */

export function isEmpty(map) {
  return Object.keys(map).length === 0;
}