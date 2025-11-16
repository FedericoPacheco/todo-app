import {
  watchGetAllTodos,
  watchAddTodo,
  watchDeleteTodo,
  watchChangeStateTodo,
  watchChangeTextTodo,
} from "./todos/sagas";
import {
  watchGetSessionStatus,
  watchLogin,
  watchLogout,
  watchSignup,
} from "./app/sagas";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    watchGetAllTodos(),
    watchAddTodo(),
    watchDeleteTodo(),
    watchChangeStateTodo(),
    watchChangeTextTodo(),
    watchLogin(),
    watchSignup(),
    watchLogout(),
    watchGetSessionStatus(),
  ]);
}
