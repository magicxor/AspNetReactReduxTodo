import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import * as actions from '../store/taskList/actions';
import { tasksService } from '../services/TasksService';

const TaskRaw = props => (
  <tr>
    <td>
      {props.data.id}
    </td>
    <td>
      {props.data.description}
    </td>
    <td>
      <Button bsStyle="danger" onClick={() => props.deleteTask(props.data.id)}>Delete</Button>
    </td>
  </tr>
);

function mapDispatchToProps(dispatch) {
  return {    
    deleteTask: async (taskId) => {
      dispatch(actions.deleteTaskStarted(taskId));
      try {
        await tasksService.deleteTaskAsync(taskId);
        dispatch(actions.deleteTaskSuccess(taskId));
      } catch (error) {
        dispatch(actions.deleteTaskFailure(error));
      }
    }
  };
}

export const Task = connect(null, mapDispatchToProps)(TaskRaw);
