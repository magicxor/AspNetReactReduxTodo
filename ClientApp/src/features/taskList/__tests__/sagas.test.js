import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { tasksService } from '../../../services/TasksService';
import * as actions from '../actions';
import { getTasksAsync, addTaskAsync, deleteTaskAsync, taskListWatcherSagas } from '../sagas';

describe('taskList sagas', () => {
  describe('getTasksAsync', () => {
    const tasks = [
      { id: 1, description: 'Task 1' },
      { id: 2, description: 'Task 2' },
    ];

    it('should handle successful tasks fetch', () => {
      return expectSaga(getTasksAsync)
        .provide([
          [matchers.call.fn(tasksService.getTasksAsync), tasks]
        ])
        .put(actions.getTasksStarted())
        .call.fn(tasksService.getTasksAsync)
        .put(actions.getTasksSuccess(tasks))
        .run();
    });

    it('should handle failed tasks fetch', () => {
      const error = new Error('Failed to fetch tasks');
      
      return expectSaga(getTasksAsync)
        .provide([
          [matchers.call.fn(tasksService.getTasksAsync), throwError(error)]
        ])
        .put(actions.getTasksStarted())
        .call.fn(tasksService.getTasksAsync)
        .put(actions.getTasksFailure(error))
        .run();
    });
  });

  describe('addTaskAsync', () => {
    const task = { description: 'New task' };
    const addTaskResult = { id: 1 };
    const taskWithId = { ...task, id: addTaskResult.id };

    it('should handle successful task addition', () => {
      return expectSaga(addTaskAsync, { task })
        .provide([
          [matchers.call.fn(tasksService.addTaskAsync), addTaskResult]
        ])
        .put(actions.getTasksStarted(task))
        .call.fn(tasksService.addTaskAsync)
        .put(actions.addTaskSuccess(taskWithId))
        .run();
    });

    it('should handle failed task addition', () => {
      const error = new Error('Failed to add task');
      
      return expectSaga(addTaskAsync, { task })
        .provide([
          [matchers.call.fn(tasksService.addTaskAsync), throwError(error)]
        ])
        .put(actions.getTasksStarted(task))
        .call.fn(tasksService.addTaskAsync)
        .put(actions.addTaskFailure(error))
        .run();
    });
  });

  describe('deleteTaskAsync', () => {
    const taskId = 1;

    it('should handle successful task deletion', () => {
      return expectSaga(deleteTaskAsync, { taskId })
        .provide([
          [matchers.call.fn(tasksService.deleteTaskAsync), undefined]
        ])
        .put(actions.deleteTaskStarted(taskId))
        .call.fn(tasksService.deleteTaskAsync)
        .put(actions.deleteTaskSuccess(taskId))
        .run();
    });

    it('should handle failed task deletion', () => {
      const error = new Error('Failed to delete task');
      
      return expectSaga(deleteTaskAsync, { taskId })
        .provide([
          [matchers.call.fn(tasksService.deleteTaskAsync), throwError(error)]
        ])
        .put(actions.deleteTaskStarted(taskId))
        .call.fn(tasksService.deleteTaskAsync)
        .put(actions.deleteTaskFailure(error))
        .run();
    });
  });

  describe('watcher sagas', () => {
    it('should export watcher sagas array with correct functions', () => {
      expect(Array.isArray(taskListWatcherSagas)).toBe(true);
      expect(taskListWatcherSagas).toHaveLength(3);
      expect(typeof taskListWatcherSagas[0]).toBe('function');
      expect(typeof taskListWatcherSagas[1]).toBe('function');
      expect(typeof taskListWatcherSagas[2]).toBe('function');
    });
  });
});
