import { takeEvery, put, call } from 'redux-saga/effects';
import { GET_ALL_TODOS, ADD_TODO, DELETE_TODO, CHANGE_STATE_TODO } from './actions';
import { getAllTodos, addTodo, deleteTodo, changeStateTodo } from '../../api/api';
import { setError, setLoading, setSuccess } from '../app/actionFunctions';
import { setAllTodos } from './actionFunctions';

// Worker sagas
function* getAllTodosSaga(action) {
    try {
        yield put(setLoading());
        const response = yield call(getAllTodos, action.payload);
        yield put(setAllTodos(response));
        yield put(setSuccess());
    } catch (error) {
        yield put(setError());
    }
}

function* addTodoSaga(action) {
    try {
        yield call(addTodo, action.payload);
        yield put(setSuccess());
    } catch (error) {
        yield put(setError());
    }
}

function* deleteTodoSaga(action) {
    try {
        yield call(deleteTodo, action.payload);
        yield put(setSuccess());
    } catch (error) {
        yield put(setError());
    }
}

function* changeStateTodoSaga(action) {
    try {
        yield call(changeStateTodo, action.payload);
        yield put(setSuccess());
    } catch (error) {
        yield put(setError());
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

