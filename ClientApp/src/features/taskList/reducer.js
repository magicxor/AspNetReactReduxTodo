import * as actionTypes from './actionTypes';

const initialState = {
    newTaskDescription: "",
    tasks: []
};

export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case actionTypes.SET_NEW_TASK_DESCRIPTION:
            return { ...state, newTaskDescription: action.taskDescription };
        // GET
        case actionTypes.GET_TASKS_STARTED:
            return { ...state, refreshInProgress: true, error: null };
        case actionTypes.GET_TASKS_SUCCESS:
            return { ...state, refreshInProgress: false, error: null, tasks: action.tasks };
        case actionTypes.GET_TASKS_FAILURE:
            return { ...state, refreshInProgress: false, error: action.error.message };
        // ADD
        case actionTypes.ADD_TASK_STARTED:
            return { ...state, refreshInProgress: true, error: null };
        case actionTypes.ADD_TASK_SUCCESS:
            return { ...state, refreshInProgress: false, error: null, tasks: [...state.tasks, { id: action.task.id, description: action.task.description }] };
        case actionTypes.ADD_TASK_FAILURE:
            return { ...state, refreshInProgress: false, error: action.error.message };
        // DELETE
        case actionTypes.DELETE_TASK_STARTED:
            return { ...state, refreshInProgress: true, error: null };
        case actionTypes.DELETE_TASK_SUCCESS:
            return { ...state, refreshInProgress: false, error: null, tasks: state.tasks.filter(item => item.id !== action.taskId) };
        case actionTypes.DELETE_TASK_FAILURE:
            return { ...state, refreshInProgress: false, error: action.error.message };
        default:
            return state;
    }
};