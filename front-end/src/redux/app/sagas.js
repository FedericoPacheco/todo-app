import { takeLatest, call, put } from 'redux-saga/effects';
import { LOGIN } from './actions';
import { login } from '../../api/api';
import { setAuthError, setAuthSuccess } from './actionFunctions';

function* loginSaga(action) {
    try {
        const wasSuccessful = yield call(login, action.payload.user, action.payload.pass);
        if (wasSuccessful) {
            yield put(setAuthSuccess());
        } else {
            yield put(setAuthError());
        }
    } catch (e) {
        yield put(setAuthError());
    }
}

export function* watchLogin() {
    yield takeLatest(LOGIN, loginSaga);
}

