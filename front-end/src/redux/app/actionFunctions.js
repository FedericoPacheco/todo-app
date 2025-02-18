import {
  LOGIN,
  LOGOUT,
  SIGNUP,
  GET_SESSION_STATUS,
  SET_API_LOADING,
  SET_API_ERROR,
  SET_API_SUCCESS,
  SET_AUTH_ERROR,
  SET_AUTH_SUCCESS,
  SET_AUTH_REQUIRED,
} from "./actions";

export const setApiLoading = () => ({
  type: SET_API_LOADING,
});

export const setApiError = () => ({
  type: SET_API_ERROR,
});

export const setApiSuccess = () => ({
  type: SET_API_SUCCESS,
});

export const setAuthError = () => ({
  type: SET_AUTH_ERROR,
});

export const setAuthSuccess = () => ({
  type: SET_AUTH_SUCCESS,
});

export const setAuthRequired = () => ({
  type: SET_AUTH_REQUIRED,
});

export const login = (user, pass) => ({
  type: LOGIN,
  payload: {
    user,
    pass,
  },
});

export const logout = () => ({
  type: LOGOUT,
});

export const signup = (user, pass) => ({
  type: SIGNUP,
  payload: {
    user,
    pass,
  },
});

export const getSessionStatus = () => ({
  type: GET_SESSION_STATUS,
});
