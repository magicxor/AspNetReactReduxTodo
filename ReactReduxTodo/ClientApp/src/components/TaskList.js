import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Button, FormControl, Alert } from 'react-bootstrap';
import { Task } from './Task';
import * as TaskListSelectors from '../store/taskList/selectors';
import * as actions from '../store/taskList/actions';
import { tasksService } from '../services/TasksService';

class TaskListRaw extends Component {
  componentDidMount() {
    this.props.getTasks();
  }

  render() {
    return (
      <div>
        <h1>Tasks</h1>
        <div>
          <Alert bsStyle="danger" hidden={!this.props.error}>
            <strong>Error: </strong> {this.props.error}
          </Alert>
        </div>
        <div className="input-group">
          <FormControl type="text" placeholder="Task description" value={this.props.newTaskDescription} onChange={(e) => this.props.setNewTaskDescription(e.target.value)} />
          <span className="input-group-btn">
            <Button bsStyle="primary" onClick={() => this.props.addTask(this.props.newTaskDescription)}>Add</Button>
          </span>
        </div>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col-md-2">ID</th>
              <th scope="col-md-5">Description</th>
              <th scope="col-md-5">#</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.tasks.map(task => {
                return <Task key={task.id} data={task} />;
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return TaskListSelectors.getTaskListState(state);
}

function mapDispatchToProps(dispatch) {
  return {
    setNewTaskDescription: bindActionCreators(actions.setNewTaskDescription, dispatch),
    getTasks: async () => {
      dispatch(actions.getTasksStarted());
      try {
        const tasks = await tasksService.getTasksAsync();
        dispatch(actions.getTasksSuccess(tasks));
      } catch (error) {
        dispatch(actions.getTasksFailure(error));
      }
    },
    addTask: async (taskDescription) => {
      const task = { description: taskDescription };
      dispatch(actions.addTaskStarted(task));
      try {
        const taskId = await tasksService.addTaskAsync(taskDescription);
        task.id = taskId;
        dispatch(actions.addTaskSuccess(task));
      } catch (error) {
        dispatch(actions.addTaskFailure(error));
      }
    },
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

export const TaskList = connect(mapStateToProps, mapDispatchToProps)(TaskListRaw);
