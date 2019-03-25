var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n  &&& {\n    ", ";\n  }\n"]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n    float: right;\n    &:before {\n        content: 'x';\n        color: #999;\n        font-weight: 300;\n        font-family: Arial, sans-serif;\n        cursor: pointer;\n    }\n"]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import styled from 'styled-components';
export var DroppableHeaderColumn = styled.th(_templateObject, function (props) {
  return props.droppableStyle;
});
export var ClearColumn = styled.span(_templateObject2);