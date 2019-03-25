function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as PointSet from "./point-set";
import * as PointMap from "./point-map";
import * as Matrix from "./matrix";
import * as Types from "./types";
import { isActive, setCell, updateData } from "./util";
export var select = function select(state, cellPointer) {
  if (state.active && !isActive(state.active, cellPointer)) {
    return {
      selected: PointSet.from(Matrix.inclusiveRange({
        row: cellPointer.row,
        column: cellPointer.column
      }, {
        row: state.active.row,
        column: state.active.column
      })),
      mode: "view"
    };
  }

  return null;
};
export var activate = function activate(state, cellPointer) {
  return {
    selected: PointSet.from([cellPointer]),
    active: cellPointer,
    mode: isActive(state.active, cellPointer) ? "edit" : "view"
  };
};
export function setData(state, data, bindings) {
  return {
    mode: "edit",
    data: setCell(state, data),
    lastChanged: state.active,
    bindings: PointMap.set(state.active, PointSet.from(bindings), state.bindings)
  };
}
export function setCellDimensions(state, point, dimensions) {
  var prevDimensions = PointMap.get(point, state.cellDimensions);

  if (prevDimensions && prevDimensions.width === dimensions.width && prevDimensions.height === dimensions.height && prevDimensions.top === dimensions.top && prevDimensions.left === dimensions.left) {
    return null;
  }

  return {
    cellDimensions: PointMap.set(point, dimensions, state.cellDimensions)
  };
}
export var copy = function copy(state) {
  return {
    copied: PointSet.reduce(function (acc, point) {
      return PointMap.set(point, Matrix.get(point.row, point.column, state.data), acc);
    }, state.selected, PointMap.from([])),
    cut: false,
    hasPasted: false
  };
};
export var cut = function cut(state) {
  return _objectSpread({}, copy(state), {
    cut: true
  });
};
export var paste = function paste(state) {
  var minPoint = PointSet.min(state.copied);

  var _PointMap$reduce = PointMap.reduce(function (acc, value, _ref) {
    var row = _ref.row,
        column = _ref.column;

    if (!state.active) {
      return acc;
    }

    var nextRow = row - minPoint.row + state.active.row;
    var nextColumn = column - minPoint.column + state.active.column;
    var nextData = state.cut ? Matrix.unset(row, column, acc.data) : acc.data;

    if (!Matrix.has(nextRow, nextColumn, state.data)) {
      return {
        data: nextData,
        selected: acc.selected
      };
    }

    return {
      data: Matrix.set(nextRow, nextColumn, value, nextData),
      selected: PointSet.add(acc.selected, {
        row: nextRow,
        column: nextColumn
      })
    };
  }, state.copied, {
    data: state.data,
    selected: PointSet.from([])
  }),
      data = _PointMap$reduce.data,
      selected = _PointMap$reduce.selected;

  return {
    data: data,
    selected: selected,
    cut: false,
    hasPasted: true,
    mode: "view"
  };
};
export var edit = function edit() {
  return {
    mode: "edit"
  };
};
export var view = function view() {
  return {
    mode: "view"
  };
};
export var clear = function clear(state) {
  if (!state.active) {
    return null;
  }

  var _state$active = state.active,
      row = _state$active.row,
      column = _state$active.column;
  var cell = Matrix.get(row, column, state.data);
  return {
    data: PointSet.reduce(function (acc, point) {
      return updateData(acc, _objectSpread({}, point, {
        data: _objectSpread({}, cell, {
          value: ""
        })
      }));
    }, state.selected, state.data)
  };
};
export var go = function go(rowDelta, columnDelta) {
  return function (state, event) {
    if (!state.active) {
      return null;
    }

    var nextActive = {
      row: state.active.row + rowDelta,
      column: state.active.column + columnDelta
    };

    if (!Matrix.has(nextActive.row, nextActive.column, state.data)) {
      return {
        mode: "view"
      };
    }

    return {
      active: nextActive,
      selected: PointSet.from([nextActive]),
      mode: "view"
    };
  };
};
export var modifyEdge = function modifyEdge(field, delta) {
  return function (state, event) {
    if (!state.active) {
      return null;
    }

    var edgeOffsets = PointSet.has(state.selected, _objectSpread({}, state.active, _defineProperty({}, field, state.active[field] + delta * -1)));
    var nextSelected = edgeOffsets ? PointSet.shrinkEdge(state.selected, field, delta * -1) : PointSet.extendEdge(state.selected, field, delta);
    return {
      selected: PointSet.filter(function (point) {
        return Matrix.has(point.row, point.column, state.data);
      }, nextSelected)
    };
  };
}; // Key Bindings

/** @todo handle inactive state? */
var keyDownHandlers = {
  ArrowUp: go(-1, 0),
  ArrowDown: go(+1, 0),
  ArrowLeft: go(0, -1),
  ArrowRight: go(0, +1),
  Tab: go(0, +1),
  Enter: edit,
  Backspace: clear
};
var editKeyDownHandlers = {
  Escape: view,
  Tab: keyDownHandlers.Tab,
  Enter: keyDownHandlers.ArrowDown
};
var shiftKeyDownHandlers = {
  ArrowUp: modifyEdge("row", -1),
  ArrowDown: modifyEdge("row", 1),
  ArrowLeft: modifyEdge("column", -1),
  ArrowRight: modifyEdge("column", 1)
};
export function keyPress(state, event) {
  if (state.mode === "view" && state.active) {
    return {
      mode: "edit"
    };
  }

  return null;
}
export var getKeyDownHandler = function getKeyDownHandler(state, event) {
  var key = event.key;
  var handlers; // Order matters

  if (state.mode === "edit") {
    handlers = editKeyDownHandlers;
  } else if (event.shiftKey) {
    handlers = shiftKeyDownHandlers;
  } else {
    handlers = keyDownHandlers;
  }

  return handlers[key];
};
export function keyDown(state, event) {
  var handler = getKeyDownHandler(state, event);

  if (handler) {
    return handler(state, event);
  }

  return null;
}
export function dragStart(state) {
  return {
    dragging: true
  };
}
export function dragEnd(state) {
  return {
    dragging: false
  };
}