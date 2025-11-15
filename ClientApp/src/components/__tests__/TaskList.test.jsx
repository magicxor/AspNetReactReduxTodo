import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { TaskList } from '../TaskList';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';

describe('TaskList', () => {
  const initialState = {
    taskList: {
      tasks: [
        { id: 1, description: 'Test task 1' },
        { id: 2, description: 'Test task 2' },
      ],
      newTaskDescription: '',
      error: null,
    },
  };

  let store;
  let mockSetNewTaskDescription;
  let mockAddTask;

  beforeEach(() => {
    vi.useFakeTimers();
    mockSetNewTaskDescription = vi.fn();
    mockAddTask = vi.fn();

    store = configureStore({
      reducer: {
        taskList: (state = initialState.taskList) => state,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });

    store.dispatch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders task list with header and input form', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task description')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls getTasks on mount', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    // Advance timers to trigger componentDidMount
    vi.advanceTimersByTime(0);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('handles input change', () => {
    render(
      <Provider store={store}>
        <TaskList setNewTaskDescription={mockSetNewTaskDescription} />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Task description');
    fireEvent.change(input, { target: { value: 'New task' } });
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('handles add task', () => {
    render(
      <Provider store={store}>
        <TaskList addTask={mockAddTask} newTaskDescription="New task" />
      </Provider>,
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('displays error message when error exists', () => {
    const errorState = {
      ...initialState,
      taskList: {
        ...initialState.taskList,
        error: 'Test error message',
      },
    };

    const errorStore = configureStore({
      reducer: {
        taskList: (state = errorState.taskList) => state,
      },
    });

    render(
      <Provider store={errorStore}>
        <TaskList />
      </Provider>,
    );

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent('Error: Test error message');
  });
});
