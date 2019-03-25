function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Immutable interface for Matrices
 *
 * @todo use Types.Point for all point references
 *
 * 
 */
import { range as _range } from "./util";
import * as Types from "./types";

/** Gets the value at row and column of matrix. */
export function get(row, column, matrix) {
  var columns = matrix[row];

  if (columns === undefined) {
    return undefined;
  }

  return columns[column];
}
/** Creates a slice of matrix from startPoint up to, but not including, endPoint. */

export function slice(startPoint, endPoint, matrix) {
  var sliced = [];
  var columns = endPoint.column - startPoint.column;

  for (var row = startPoint.row; row <= endPoint.row; row++) {
    var slicedRow = row - startPoint.row;
    sliced[slicedRow] = sliced[slicedRow] || Array(columns);

    for (var column = startPoint.column; column <= endPoint.column; column++) {
      sliced[slicedRow][column - startPoint.column] = get(row, column, matrix);
    }
  }

  return sliced;
}
/** Sets the value at row and column of matrix. If a row doesn't exist, it's created. */

export function set(row, column, value, matrix) {
  var nextMatrix = _toConsumableArray(matrix); // Synchronize first row length


  var firstRow = matrix[0];
  var nextFirstRow = firstRow ? _toConsumableArray(firstRow) : [];

  if (nextFirstRow.length - 1 < column) {
    nextFirstRow[column] = undefined;
    nextMatrix[0] = nextFirstRow;
  }

  var nextRow = matrix[row] ? _toConsumableArray(matrix[row]) : [];
  nextRow[column] = value;
  nextMatrix[row] = nextRow;
  return nextMatrix;
}
/** Like Matrix.set() but mutates the matrix */

export function mutableSet(row, column, value, matrix) {
  var firstRow = matrix[0];

  if (!firstRow) {
    firstRow = [];
    matrix[0] = firstRow;
  }

  if (!(row in matrix)) {
    matrix[row] = [];
  } // Synchronize first row length


  if (!(column in firstRow)) {
    firstRow[column] = undefined;
  }

  matrix[row][column] = value;
}
/** Removes the coordinate of matrix */

export function unset(row, column, matrix) {
  if (!has(row, column, matrix)) {
    return matrix;
  }

  var nextMatrix = _toConsumableArray(matrix);

  var nextRow = _toConsumableArray(matrix[row]); // Avoid deleting to preserve first row length


  nextRow[column] = undefined;
  nextMatrix[row] = nextRow;
  return nextMatrix;
}
export function reduce(func, matrix, initialValue) {
  var _getSize = getSize(matrix),
      rows = _getSize.rows,
      columns = _getSize.columns;

  var acc = initialValue;

  for (var row = 0; row < rows; row++) {
    if (!matrix[row]) {
      continue;
    }

    for (var column = 0; column < columns; column++) {
      if (column in matrix[row]) {
        acc = func(acc, matrix[row][column], {
          row: row,
          column: column
        });
      }
    }
  }

  return acc;
}
/** Creates an array of values by running each element in collection thru iteratee. */

export function map(func, matrix) {
  return reduce(function (acc, value, point) {
    mutableSet(point.row, point.column, func(value, point), acc);
    return acc;
  }, matrix, []);
}
/**
 * Converts all elements in row into a string separated by horizontalSeparator and each row string
 * to string separated by verticalSeparator
 */

export function join(matrix) {
  var horizontalSeparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ", ";
  var verticalSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "\n";
  var joined = "";

  var _getSize2 = getSize(matrix),
      rows = _getSize2.rows,
      columns = _getSize2.columns;

  for (var row = 0; row < rows; row++) {
    if (row) {
      joined += verticalSeparator;
    }

    for (var column = 0; column < columns; column++) {
      if (column) {
        joined += horizontalSeparator;
      }

      if (matrix[row] && column in matrix[row]) {
        joined += String(matrix[row][column]);
      }
    }
  }

  return joined;
}
/** Returns whether the point exists in the matrix or not. */

export function has(row, column, matrix) {
  var firstRow = matrix[0];
  return firstRow && // validation
  row >= 0 && column >= 0 && Number.isInteger(row) && Number.isInteger(column) && // first row length is in sync with other rows
  column < firstRow.length && row < matrix.length;
}

/** Gets the size of matrix by returning its number of rows and columns */
export function getSize(matrix) {
  var firstRow = matrix[0];
  return {
    columns: firstRow ? firstRow.length : 0,
    rows: matrix.length
  };
}
/** Creates an array of points (positive and/or negative) progressing from startPoint up to, but not including, endPoint. */

export function range(endPoint, startPoint) {
  var points = [];
  var columnsRange = startPoint.column !== endPoint.column ? _range(endPoint.column, startPoint.column) : startPoint.row !== endPoint.row ? [startPoint.column] : [];
  var rowsRange = startPoint.row !== endPoint.row ? _range(endPoint.row, startPoint.row) : startPoint.column !== endPoint.column ? [startPoint.row] : [];

  for (var i = 0; i < rowsRange.length; i++) {
    var row = rowsRange[i];

    for (var j = 0; j < columnsRange.length; j++) {
      var column = columnsRange[j];
      points.push({
        row: row,
        column: column
      });
    }
  }

  return points;
}
/** Like Matrix.range() but including endPoint. */

export var inclusiveRange = function inclusiveRange(endPoint, startPoint) {
  return range({
    row: endPoint.row + Math.sign(endPoint.row - startPoint.row),
    column: endPoint.column + Math.sign(endPoint.column - startPoint.column)
  }, startPoint);
};
export function toArray(matrix, transform) {
  var array = [];

  for (var row = 0; row < matrix.length; row++) {
    for (var column = 0; column < matrix.length; column++) {
      var value = matrix[row][column];
      array.push(transform ? transform(value) : value);
    }
  }

  return array;
}