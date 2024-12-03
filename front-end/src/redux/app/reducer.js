import { SET_API_ERROR, SET_API_LOADING, SET_API_SUCCESS, SET_AUTH_ERROR, SET_AUTH_REQUIRED, SET_AUTH_SUCCESS, LOGIN, LOGOUT, SIGNUP, GET_SESSION_STATUS } from "./actions";
import { API_ERROR, API_LOADING, API_SUCCESS, AUTH_ERROR, AUTH_SUCCESS, AUTH_REQUIRED } from "./constants";

const DEFAULT_STATE = {
    apiStatus: API_LOADING,
    authStatus: AUTH_REQUIRED,
}

export const appReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_API_LOADING: {
            return {
                ...state,
                apiStatus: API_LOADING,
            };
        }
        case SET_API_ERROR: {
            return {
                ...state,
                apiStatus: API_ERROR,
            };
        }
        case SET_API_SUCCESS: {
            return {
                ...state,
                apiStatus: API_SUCCESS,
            };
        }
        case SET_AUTH_ERROR: {
            return {
                ...state,
                authStatus: AUTH_ERROR,
            };
        }
        case SET_AUTH_SUCCESS: {
            return {
                ...state,
                authStatus: AUTH_SUCCESS,
            };
        }
        case SET_AUTH_REQUIRED: {
            return {
                ...state,
                authStatus: AUTH_REQUIRED,
            };
        }
        // authStatus controled by sagas
        case LOGIN: {
            return state; 
        }
        case LOGOUT: {
            return state; 
        }
        case SIGNUP: {
            return state; 
        }
        case GET_SESSION_STATUS: {
            return state;
        }
        default: {
            return state;
        }
    }
}