function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Immutable Set like interface of points
 *
 * 
 */
import * as PointMap from "./point-map";

/** Appends a new point to the Set object */
export var add = function add(set, point) {
  return PointMap.set(point, true, set);
};
/** Removes the point from the Set object */

export var remove = function remove(set, point) {
  return PointMap.unset(point, set);
};
/** Returns a boolean asserting whether an point is present with the given value in the Set object or not */

export var has = function has(set, point) {
  return PointMap.has(point, set);
};
/** Returns the number of points in a PointSet object */

export var size = function size(set) {
  return PointMap.size(set);
};
/** Applies a function against an accumulator and each point in the set (from left to right) to reduce it to a single value */

export function reduce(func, set, initialValue) {
  return PointMap.reduce(function (acc, _, point) {
    return func(acc, point);
  }, set, initialValue);
}
/** Creates a new set with the results of calling a provided function on every point in the calling set */

export function map(func, set) {
  return reduce(function (acc, point) {
    return add(acc, func(point));
  }, set, from([]));
}
/** Creates a new set with all points that pass the test implemented by the provided function */

export function filter(func, set) {
  return reduce(function (acc, point) {
    if (func(point)) {
      return add(acc, point);
    }

    return acc;
  }, set, from([]));
}

var minKey = function minKey(object // $FlowFixMe
) {
  return Math.min.apply(Math, _toConsumableArray(Object.keys(object)));
};
/** Returns the point on the minimal row in the minimal column in the set */


export function min(set) {
  var row = minKey(set);
  return {
    row: row,
    column: minKey(set[row])
  };
}

var maxKey = function maxKey(object // $FlowFixMe
) {
  return Math.max.apply(Math, _toConsumableArray(Object.keys(object)));
};
/** Returns the point on the maximal row in the maximal column in the set */


export function max(set) {
  var row = maxKey(set);
  return {
    row: row,
    column: maxKey(set[row])
  };
}
/** Creates a new PointSet instance from an array-like or iterable object */

export function from(points) {
  return points.reduce(add, PointMap.from([]));
}
/** Returns whether set has any points in */

export var isEmpty = function isEmpty(set) {
  return PointMap.isEmpty(set);
};
/** Returns an array of the set points */

export function toArray(set) {
  return reduce(function (acc, point) {
    return _toConsumableArray(acc).concat([point]);
  }, set, []);
}
var NO_EDGE = {
  left: false,
  right: false,
  top: false,
  bottom: false
};
export function onEdge(set, point) {
  if (!has(set, point)) {
    return NO_EDGE;
  }

  var hasNot = function hasNot(rowDelta, columnDelta) {
    return !has(set, {
      row: point.row + rowDelta,
      column: point.column + columnDelta
    });
  };

  return {
    left: hasNot(0, -1),
    right: hasNot(0, 1),
    top: hasNot(-1, 0),
    bottom: hasNot(1, 0)
  };
}
export function getEdgeValue(set, field, delta) {
  var compare = Math.sign(delta) === -1 ? Math.min : Math.max;

  if (size(set) === 0) {
    throw new Error("getEdgeValue() should never be called with an empty set");
  } // $FlowFixMe


  return reduce(function (acc, point) {
    if (acc === null) {
      return point[field];
    }

    return compare(acc, point[field]);
  }, set, null);
}
export function extendEdge(set, field, delta) {
  var oppositeField = field === "row" ? "column" : "row";
  var edgeValue = getEdgeValue(set, field, delta);
  return reduce(function (acc, point) {
    if (point[field] === edgeValue) {
      var _add;

      return add(acc, (_add = {}, _defineProperty(_add, field, edgeValue + delta), _defineProperty(_add, oppositeField, point[oppositeField]), _add));
    }

    return acc;
  }, set, set);
}
export function shrinkEdge(set, field, delta) {
  var edgeValue = getEdgeValue(set, field, delta);
  return reduce(function (acc, point) {
    if (point[field] === edgeValue) {
      return remove(acc, point);
    }

    return acc;
  }, set, set);
}