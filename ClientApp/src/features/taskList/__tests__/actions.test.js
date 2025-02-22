import * as actions from '../actions';
import * as types from '../actionTypes';
import { describe, it, expect } from 'vitest';

describe('taskList actions', () => {
  describe('setNewTaskDescription', () => {
    it('should create an action to set new task description', () => {
      const taskDescription = 'New task';
      const expectedAction = {
        type: types.SET_NEW_TASK_DESCRIPTION,
        taskDescription,
      };
      expect(actions.setNewTaskDescription(taskDescription)).toEqual(expectedAction);
    });
  });

  describe('getTasks actions', () => {
    it('should create an action to get tasks', () => {
      const expectedAction = {
        type: types.GET_TASKS,
      };
      expect(actions.getTasks()).toEqual(expectedAction);
    });

    it('should create an action for get tasks started', () => {
      const expectedAction = {
        type: types.GET_TASKS_STARTED,
      };
      expect(actions.getTasksStarted()).toEqual(expectedAction);
    });

    it('should create an action for get tasks success', () => {
      const tasks = [
        { id: 1, description: 'Task 1' },
        { id: 2, description: 'Task 2' },
      ];
      const expectedAction = {
        type: types.GET_TASKS_SUCCESS,
        tasks,
      };
      expect(actions.getTasksSuccess(tasks)).toEqual(expectedAction);
    });

    it('should create an action for get tasks failure', () => {
      const error = new Error('Failed to fetch tasks');
      const expectedAction = {
        type: types.GET_TASKS_FAILURE,
        error,
      };
      expect(actions.getTasksFailure(error)).toEqual(expectedAction);
    });
  });

  describe('addTask actions', () => {
    const task = { description: 'New task' };

    it('should create an action to add task', () => {
      const expectedAction = {
        type: types.ADD_TASK,
        task,
      };
      expect(actions.addTask(task)).toEqual(expectedAction);
    });

    it('should create an action for add task started', () => {
      const expectedAction = {
        type: types.ADD_TASK_STARTED,
        task,
      };
      expect(actions.addTaskStarted(task)).toEqual(expectedAction);
    });

    it('should create an action for add task success', () => {
      const taskWithId = { ...task, id: 1 };
      const expectedAction = {
        type: types.ADD_TASK_SUCCESS,
        task: taskWithId,
      };
      expect(actions.addTaskSuccess(taskWithId)).toEqual(expectedAction);
    });

    it('should create an action for add task failure', () => {
      const error = new Error('Failed to add task');
      const expectedAction = {
        type: types.ADD_TASK_FAILURE,
        error,
      };
      expect(actions.addTaskFailure(error)).toEqual(expectedAction);
    });
  });

  describe('deleteTask actions', () => {
    const taskId = 1;

    it('should create an action to delete task', () => {
      const expectedAction = {
        type: types.DELETE_TASK,
        taskId,
      };
      expect(actions.deleteTask(taskId)).toEqual(expectedAction);
    });

    it('should create an action for delete task started', () => {
      const expectedAction = {
        type: types.DELETE_TASK_STARTED,
        taskId,
      };
      expect(actions.deleteTaskStarted(taskId)).toEqual(expectedAction);
    });

    it('should create an action for delete task success', () => {
      const expectedAction = {
        type: types.DELETE_TASK_SUCCESS,
        taskId,
      };
      expect(actions.deleteTaskSuccess(taskId)).toEqual(expectedAction);
    });

    it('should create an action for delete task failure', () => {
      const error = new Error('Failed to delete task');
      const expectedAction = {
        type: types.DELETE_TASK_FAILURE,
        error,
      };
      expect(actions.deleteTaskFailure(error)).toEqual(expectedAction);
    });
  });
});
