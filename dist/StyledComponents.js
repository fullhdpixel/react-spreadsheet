var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n  &&& {\n    ", ";\n  }\n"]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import styled from 'styled-components';
export var DroppableHeaderColumn = styled.th(_templateObject, function (props) {
  return props.droppableStyle;
});