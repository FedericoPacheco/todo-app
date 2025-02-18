import {
  ADD_TODO,
  DELETE_TODO,
  CHANGE_STATE_TODO,
  GET_ALL_TODOS,
  SET_ALL_TODOS,
} from "./actions";

export const getAllTodos = () => ({
  type: GET_ALL_TODOS,
});

export const setAllTodos = (todos) => ({
  type: SET_ALL_TODOS,
  payload: { todos },
});

export const addTodo = (todo) => ({
  type: ADD_TODO,
  payload: { todo },
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: { id },
});

export const changeStateTodo = (id, newTodoState) => ({
  type: CHANGE_STATE_TODO,
  payload: { id, newTodoState },
});
