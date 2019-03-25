import styled from 'styled-components'

export const DroppableHeaderColumn = styled.th `
  &&& {
    ${props => props.droppableStyle};
  }
`

export const ClearColumn = styled.span`
    float: right;
    &:before {
        content: 'x';
        color: #999;
        font-weight: 300;
        font-family: Arial, sans-serif;
        cursor: pointer;
    }
`