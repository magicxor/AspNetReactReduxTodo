import * as types from './actionTypes';
import { call, put, takeEvery } from 'redux-saga/effects';
import { tasksService } from '../../services/TasksService';
import * as actions from './actions';

function* getTasksAsync() {
  yield put(actions.getTasksStarted());
  try {
    const tasks = yield call(tasksService.getTasksAsync);
    yield put(actions.getTasksSuccess(tasks));
  } catch (error) {
    yield put(actions.getTasksFailure(error));
  }
}

function* watchGetTasks() {
  yield takeEvery(types.GET_TASKS, getTasksAsync);
}

function* addTaskAsync(action) {
  const { task } = action;
  yield put(actions.getTasksStarted(task));
  try {
    const addTaskResult = yield call(tasksService.addTaskAsync, task.description);
    task.id = addTaskResult.id;
    yield put(actions.addTaskSuccess(task));
  } catch (error) {
    yield put(actions.addTaskFailure(error));
  }
}

function* watchAddTask() {
  yield takeEvery(types.ADD_TASK, addTaskAsync);
}

function* deleteTaskAsync(action) {
  const { taskId } = action;
  yield put(actions.deleteTaskStarted(taskId));
  try {
    yield call(tasksService.deleteTaskAsync, taskId);
    yield put(actions.deleteTaskSuccess(taskId));
  } catch (error) {
    yield put(actions.deleteTaskFailure(error));
  }
}

function* watchDeleteTask() {
  yield takeEvery(types.DELETE_TASK, deleteTaskAsync);
}

export const taskListWatcherSagas = [watchGetTasks, watchAddTask, watchDeleteTask];
