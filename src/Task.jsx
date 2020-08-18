import React from "react";
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  padding: 8px;
  border 1px solid lightgrey;
  border-radius: 2px;
  background-color: ${props => props.isDragging ? "lightgreen": props.isDragDisabled ? "lightgrey" : "white" };
  display: flex;
  align-items: center;
`;

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 5px;
  margin: 5px;
`;

export default class extends React.PureComponent {
  render() {
    const {task, index} = this.props;
    const isDragDisabled = task.id === "task-1"
    return (
      <Draggable
        draggableId={task.id}
        index={index}
        isDragDisabled={isDragDisabled}
      >
        {
          (provided, snapshot) => (
            <Container
              {...provided.draggableProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              isDragDisabled={isDragDisabled}
            >
              <Handle {...provided.dragHandleProps} />
              {task.content}
            </Container>
          )
        }
      </Draggable>
    );
  }
}
