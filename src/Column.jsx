import React from "react";
import styled from "styled-components";
import Task from "./Task";
import {Droppable, Draggable} from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border 1px solid lightgrey;
  border-radius: 2px;
  width: 30vw;
  display: flex;
  flex-direction: column;
  background-color: white
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => props.isDraggingOver ? "skyblue": "white"};
  flex-grow: 1;
`;

class InnerList extends React.PureComponent {

  render() {
    const { tasks } = this.props;

    return tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
              />
            ));
  }
}

export default class extends React.PureComponent {
  render() {
    const {column, tasks, index} = this.props;

    return (
      <Draggable
        draggableId={column.id}
        index={index}
      >
        {
          (provided) => (
            <Container
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <Title {...provided.dragHandleProps}>
                {column.title}
              </Title>

              <Droppable
                droppableId={this.props.column.id}
                // type={this.props.column.id === "column-3" ? "done" : "active"}
                isDropDisabled={this.props.isDropDisabled}
                type={"task"}
              >
                {
                  (provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      <InnerList tasks={tasks}/>

                      {provided.placeholder}
                    </TaskList>
                  )
                }
              </Droppable>
            </Container>
          )
        }
      </Draggable>
    );
  }
}
