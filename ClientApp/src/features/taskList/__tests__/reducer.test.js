import { reducer } from '../reducer';
import * as actions from '../actions';
import { describe, it, expect } from 'vitest';

describe('taskList reducer', () => {
  const initialState = {
    newTaskDescription: '',
    tasks: [],
  };

  it('should return initial state when no state is provided', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle SET_NEW_TASK_DESCRIPTION', () => {
    const taskDescription = 'New task';
    const action = actions.setNewTaskDescription(taskDescription);

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      newTaskDescription: taskDescription,
    });
  });

  describe('GET_TASKS actions', () => {
    it('should handle GET_TASKS_STARTED', () => {
      const action = actions.getTasksStarted();

      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        refreshInProgress: true,
        error: null,
      });
    });

    it('should handle GET_TASKS_SUCCESS', () => {
      const tasks = [
        { id: 1, description: 'Task 1' },
        { id: 2, description: 'Task 2' },
      ];
      const action = actions.getTasksSuccess(tasks);

      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        refreshInProgress: false,
        error: null,
        tasks,
      });
    });

    it('should handle GET_TASKS_FAILURE', () => {
      const error = new Error('Failed to fetch tasks');
      const action = actions.getTasksFailure(error);

      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        refreshInProgress: false,
        error: error.message,
      });
    });
  });

  describe('ADD_TASK actions', () => {
    it('should handle ADD_TASK_STARTED', () => {
      const task = { description: 'New task' };
      const action = actions.addTaskStarted(task);

      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        refreshInProgress: true,
        error: null,
      });
    });

    it('should handle ADD_TASK_SUCCESS', () => {
      const task = { id: 1, description: 'New task' };
      const action = actions.addTaskSuccess(task);

      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        refreshInProgress: false,
        error: null,
        tasks: [task],
      });
    });

    it('should handle ADD_TASK_FAILURE', () => {
      const error = new Error('Failed to add task');
      const action = actions.addTaskFailure(error);

      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        refreshInProgress: false,
        error: error.message,
      });
    });
  });

  describe('DELETE_TASK actions', () => {
    const stateWithTasks = {
      ...initialState,
      tasks: [
        { id: 1, description: 'Task 1' },
        { id: 2, description: 'Task 2' },
      ],
    };

    it('should handle DELETE_TASK_STARTED', () => {
      const taskId = 1;
      const action = actions.deleteTaskStarted(taskId);

      expect(reducer(stateWithTasks, action)).toEqual({
        ...stateWithTasks,
        refreshInProgress: true,
        error: null,
      });
    });

    it('should handle DELETE_TASK_SUCCESS', () => {
      const taskId = 1;
      const action = actions.deleteTaskSuccess(taskId);

      expect(reducer(stateWithTasks, action)).toEqual({
        ...stateWithTasks,
        refreshInProgress: false,
        error: null,
        tasks: stateWithTasks.tasks.filter((task) => task.id !== taskId),
      });
    });

    it('should handle DELETE_TASK_FAILURE', () => {
      const error = new Error('Failed to delete task');
      const action = actions.deleteTaskFailure(error);

      expect(reducer(stateWithTasks, action)).toEqual({
        ...stateWithTasks,
        refreshInProgress: false,
        error: error.message,
      });
    });
  });
});
