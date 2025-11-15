import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Task } from '../Task';
import { describe, it, vi, expect } from 'vitest';

describe('Task', () => {
  const mockTask = {
    id: 1,
    description: 'Test task',
  };

  const createMockStore = () => {
    return configureStore({
      reducer: {
        taskList: (state = { tasks: [], newTaskDescription: '' }) => state,
      },
    });
  };

  it('renders task information correctly', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <table>
          <tbody>
            <Task data={mockTask} />
          </tbody>
        </table>
      </Provider>,
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls deleteTask when delete button is clicked', () => {
    const mockDeleteTask = vi.fn();
    const store = createMockStore();

    store.dispatch = mockDeleteTask;

    render(
      <Provider store={store}>
        <table>
          <tbody>
            <Task data={mockTask} />
          </tbody>
        </table>
      </Provider>,
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockDeleteTask).toHaveBeenCalled();
  });
});
