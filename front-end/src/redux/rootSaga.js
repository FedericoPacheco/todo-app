import { watchGetAllTodos, watchAddTodo, watchDeleteTodo, watchChangeStateTodo } from './todos/sagas';
import { watchLogin } from './app/sagas';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
    yield all([
        watchGetAllTodos(),
        watchAddTodo(),
        watchDeleteTodo(),
        watchChangeStateTodo(),
        watchLogin(),
    ]);
}
