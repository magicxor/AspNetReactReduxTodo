import * as selectors from '../selectors';
import { describe, it, expect } from 'vitest';

describe('taskList selectors', () => {
  it('should select taskList state', () => {
    const taskList = {
      tasks: [
        { id: 1, description: 'Task 1' },
        { id: 2, description: 'Task 2' },
      ],
      newTaskDescription: 'New task',
      error: null,
      refreshInProgress: false,
    };

    const state = {
      taskList,
      otherState: {},
    };

    expect(selectors.getTaskListState(state)).toEqual(taskList);
  });
});
