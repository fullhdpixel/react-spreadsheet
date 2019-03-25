function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import * as Types from "./types";
import { extractLabel } from "hot-formula-parser/lib/helper/cell";

function isFormulaCell(cell) {
  return Boolean(cell && cell.value && typeof cell.value === "string" && cell.value.startsWith("="));
}

var FORMULA_CELL_REFERENCES = /\$?[A-Z]+\$?[0-9]+/g;
/** @todo move me */

export function getBindingsForCell(cell) {
  if (!isFormulaCell(cell)) {
    return [];
  }

  var value = cell.value; // Get raw cell references from formula

  var match = value.match(FORMULA_CELL_REFERENCES);

  if (!match) {
    return [];
  } // Normalize references to points


  return match.map(function (substr) {
    var _extractLabel = extractLabel(substr),
        _extractLabel2 = _slicedToArray(_extractLabel, 2),
        row = _extractLabel2[0],
        column = _extractLabel2[1];

    return {
      row: row.index,
      column: column.index
    };
  }, {});
}