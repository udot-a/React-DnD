import React from 'react';
import './App.css';
import initialData from "./initial-data";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Column from "./Column";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  margin: 20px;
`;

class App extends React.PureComponent {
  state = initialData;

  onDragEnd = result => {
    this.setState({homeIndex: null})

    document.body.style.color = "inherit";
    document.body.style.backgroundColor = "inherit";

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }

    if (type==="column") {
      const newColumnOrder = [...this.state.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder
      }

      this.setState(newState)
      return;

    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }

      this.setState(newState);
      return;

    }

  //  Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskId = Array.from(finish.taskIds);
    finishTaskId.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskId
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    this.setState(newState);
  }


  onDragStart = start => {
    document.body.style.color = "orange";
    document.body.style.transition = "background-color 0.2s easy";

    const homeIndex= this.state.columnOrder.indexOf(start.source.droppableId);

    this.setState({homeIndex})
  }

  onDragUpdate = update => {
    const {destination} = update;

    const opacity = destination
      ? destination.index / Object.keys(this.state.tasks).length
      : 0;

    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragUpdate={this.onDragUpdate}
      >
        <Droppable
          droppableId={"all-columns"}
          direction={"horizontal"}
          type={"column"}
        >
          {
            (provided) => (
              <Container
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  this.state.columnOrder.map((columnId, index) => {
                    const column = this.state.columns[columnId];

                    const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                    const isDropDisabled = index < this.state.homeIndex;

                    return <Column
                      key={column.id}
                      index={index}
                      column={column}
                      tasks={tasks}
                      isDropDisabled={isDropDisabled}
                    />
                  })
                }
                {provided.placeholder}
              </Container>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

export default App;
