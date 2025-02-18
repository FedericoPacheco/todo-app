import { takeLatest, call, put } from "redux-saga/effects";
import { LOGIN, LOGOUT, SIGNUP, GET_SESSION_STATUS } from "./actions";
import { login, logout, signup, getSessionStatus } from "./api";
import {
  setAuthError,
  setAuthRequired,
  setAuthSuccess,
} from "./actionFunctions";

function* loginSaga(action) {
  try {
    const wasSuccessful = yield call(
      login,
      action.payload.user,
      action.payload.pass,
    );
    if (wasSuccessful) {
      yield put(setAuthSuccess());
    } else {
      yield put(setAuthError());
    }
  } catch (e) {
    yield put(setAuthError());
  }
}

function* logoutSaga() {
  try {
    yield call(logout);
    yield put(setAuthRequired());
  } catch (e) {
    yield put(setAuthError());
  }
}

function* signupSaga(action) {
  try {
    const wasSuccessful = yield call(
      signup,
      action.payload.user,
      action.payload.pass,
    );
    if (wasSuccessful) {
      yield put(setAuthSuccess());
    } else {
      yield put(setAuthError());
    }
  } catch (e) {
    yield put(setAuthError());
  }
}

function* getSessionStatusSaga() {
  try {
    const isAuthenticated = yield call(getSessionStatus);
    if (isAuthenticated) {
      yield put(setAuthSuccess());
    } else {
      yield put(setAuthRequired());
    }
  } catch (e) {
    yield put(setAuthError());
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, loginSaga);
}

export function* watchLogout() {
  yield takeLatest(LOGOUT, logoutSaga);
}

export function* watchSignup() {
  yield takeLatest(SIGNUP, signupSaga);
}

export function* watchGetSessionStatus() {
  yield takeLatest(GET_SESSION_STATUS, getSessionStatusSaga);
}
