import React from "react";

var Table = function Table(_ref) {
  var children = _ref.children;
  return React.createElement("table", {
    className: "SpreadsheetTable"
  }, React.createElement("tbody", null, children));
};

export default Table;