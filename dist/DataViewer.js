import React from "react";
import * as Types from "./types";

var toView = function toView(value) {
  if (value === false) {
    return React.createElement("div", {
      className: "boolean"
    }, "FALSE");
  }

  if (value === true) {
    return React.createElement("div", {
      className: "boolean"
    }, "TRUE");
  }

  return value;
};

var DataViewer = function DataViewer(_ref) {
  var getValue = _ref.getValue,
      cell = _ref.cell,
      column = _ref.column,
      row = _ref.row,
      formulaParser = _ref.formulaParser;
  var rawValue = getValue({
    data: cell,
    column: column,
    row: row
  });

  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    var _formulaParser$parse = formulaParser.parse(rawValue.slice(1)),
        result = _formulaParser$parse.result,
        error = _formulaParser$parse.error;

    return error || toView(result);
  }

  return toView(rawValue);
};

export default DataViewer;