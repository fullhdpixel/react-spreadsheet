import React from 'react'

import Spreadsheet from '../src/SpreadsheetStateProvider'
import {range} from '../src/util'
import './index.css'

export const INITIAL_ROWS = 6
export const INITIAL_COLUMNS = 4

const resetHeaders = [0,1,2,3]

class DoubleColumns extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            initialData: range(INITIAL_ROWS).map(() => Array(INITIAL_COLUMNS)),
            columnLabels: ["Name", "Age", "Email", "Address"],
            droppableHeaderLabels: resetHeaders.map(item => null),
            isDragging: false
        }
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
        // check if already dropped
        const existingDraggedIndex = droppableHeaderLabels.indexOf(this.draggedItem)
        if (existingDraggedIndex > -1) {
          droppableHeaderLabels[existingDraggedIndex] = null
        }
        droppableHeaderLabels[index] = this.draggedItem
        return {droppableHeaderLabels}
      })
    }

    clearColumn = (e, index) => {
        console.info('clearColumn', index)
        this.setState(({droppableHeaderLabels}) => {
            droppableHeaderLabels[index] = null
            return {droppableHeaderLabels}
        })
    }

    render() {
        const {initialData, columnLabels, droppableHeaderLabels, isDragging} = this.state
        return <React.Fragment>
            <ul>
              {resetHeaders.map((item, index) => <li
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
              isDragging={true}
              onDrop={(e, index) => this.onDrop(e, index)}
              onDragOver={e => this.onDragOver(e)}
              clearColumn={(e, index) => this.clearColumn(e, index)}
              clearHeaderIconClass={'fas fa-times'}
            />
        </React.Fragment>
    }

}

export default DoubleColumns
