import { takeEvery, put, call } from 'redux-saga/effects';
import { GET_ALL_TODOS, ADD_TODO, DELETE_TODO, CHANGE_STATE_TODO } from './actions';
import { getAllTodos, addTodo, deleteTodo, changeStateTodo } from './api';
import { setApiError, setApiLoading, setApiSuccess } from '../app/actionFunctions';
import { setAllTodos } from './actionFunctions';

// Worker sagas
function* getAllTodosSaga(action) {
    try {
        yield put(setApiLoading());
        const response = yield call(getAllTodos, action.payload);
        yield put(setAllTodos(response));
        yield put(setApiSuccess());
    } catch (error) {
        yield put(setApiError());
    }
}

function* addTodoSaga(action) {
    try {
        yield call(addTodo, action.payload.todo);
        yield put(setApiSuccess());
    } catch (error) {
        yield put(setApiError());
    }
}

function* deleteTodoSaga(action) {
    console.log("sagas: deleteTodoSaga(): action:", action.payload);
    try {
        yield call(deleteTodo, action.payload.id);
        yield put(setApiSuccess());
    } catch (error) {
        yield put(setApiError());
    }
}

function* changeStateTodoSaga(action) {
    try {
        yield call(changeStateTodo, action.payload.id, action.payload.newTodoState);
        yield put(setApiSuccess());
    } catch (error) {
        yield put(setApiError());
    }
}    


// Watcher sagas
export function* watchGetAllTodos() {
    yield takeEvery(GET_ALL_TODOS, getAllTodosSaga);
}

export function* watchAddTodo() {
    yield takeEvery(ADD_TODO, addTodoSaga);
}

export function* watchDeleteTodo() {
    yield takeEvery(DELETE_TODO, deleteTodoSaga);
}

export function* watchChangeStateTodo() {
    yield takeEvery(CHANGE_STATE_TODO, changeStateTodoSaga);
}

