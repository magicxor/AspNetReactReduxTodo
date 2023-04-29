import * as types from './actionTypes';

export function setNewTaskDescription(taskDescription) {
  return {
    type: types.SET_NEW_TASK_DESCRIPTION,
    taskDescription,
  };
}

// GET

export function getTasks() {
  return {
    type: types.GET_TASKS,
  };
}

export function getTasksStarted() {
  return {
    type: types.GET_TASKS_STARTED,
  };
}

export function getTasksSuccess(tasks) {
  return {
    type: types.GET_TASKS_SUCCESS,
    tasks,
  };
}

export function getTasksFailure(error) {
  return {
    type: types.GET_TASKS_FAILURE,
    error,
  };
}

// ADD

export function addTask(task) {
  return {
    type: types.ADD_TASK,
    task,
  };
}

export function addTaskStarted(task) {
  return {
    type: types.ADD_TASK_STARTED,
    task,
  };
}

export function addTaskSuccess(task) {
  return {
    type: types.ADD_TASK_SUCCESS,
    task,
  };
}

export function addTaskFailure(error) {
  return {
    type: types.ADD_TASK_FAILURE,
    error,
  };
}

// DELETE

export function deleteTask(taskId) {
  return {
    type: types.DELETE_TASK,
    taskId,
  };
}

export function deleteTaskStarted(taskId) {
  return {
    type: types.DELETE_TASK_STARTED,
    taskId,
  };
}

export function deleteTaskSuccess(taskId) {
  return {
    type: types.DELETE_TASK_SUCCESS,
    taskId,
  };
}

export function deleteTaskFailure(error) {
  return {
    type: types.DELETE_TASK_FAILURE,
    error,
  };
}
