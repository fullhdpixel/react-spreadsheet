import React from 'react'

import Spreadsheet from '../src/SpreadsheetStateProvider'
import {range} from '../src/util'
import './index.css'

export const INITIAL_ROWS = 6
export const INITIAL_COLUMNS = 4

class DoubleColumns extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            initialData: range(INITIAL_ROWS).map(() => Array(INITIAL_COLUMNS)),
            columnLabels: ["Name", "Age", "Email", "Address"],
            droppableHeaderLabels: [1,2,3,4],
            isDragging: false
        }
    }

    changeLabels = () => {
        this.setState(({columnLabels, isDragging}) => {
            const labels = columnLabels[0] === 1
                ? ["Name", "Age", "Email", "Address"]
                : [1, 2, 3, 4]
            return {columnLabels: labels, isDragging: !isDragging}
        })
    }

    onDragStart = (e, index) => {
      this.draggedItem = index
    }
    onDragOver = (e) => {
      e.stopPropagation()
      e.preventDefault()
    }
    onDrop = (e, index) => {
      this.setState(({droppableHeaderLabels}) => {
        droppableHeaderLabels[index] = this.draggedItem
        return {droppableHeaderLabels}
      })
    }

    render() {
        const {initialData, columnLabels, droppableHeaderLabels, isDragging} = this.state
        return <React.Fragment>
            <button onClick={() => this.changeLabels()}>Change labels</button>
            <ul>
              {droppableHeaderLabels.map((item, index) => <li
                key={index}
                draggable
                onDragStart={e => this.onDragStart(e, item)}>{item}</li>)}
            </ul>
            <Spreadsheet
              data={initialData}
              droppableHeaderLabels={droppableHeaderLabels}
              columnLabels={columnLabels}
              droppableStyle={`
                background: aliceblue;
              `}
              isDragging={isDragging}
              onDrop={(e, index) => this.onDrop(e, index)}
              onDragOver={e => this.onDragOver(e)}/>
        </React.Fragment>
    }

}

export default DoubleColumns
