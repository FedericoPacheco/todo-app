import { SET_ERROR, SET_LOADING, SET_SUCCESS } from "./actions";
import { LOADING, SUCCESS } from "./constants";

const DEFAULT_STATE = {
    status: SUCCESS,
}

export const appReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_LOADING: {
            return {
                ...state,
                status: LOADING,
            };
        }
        case SET_ERROR: {
            return {
                ...state,
                status: SET_ERROR,
            };
        }
        case SET_SUCCESS: {
            return {
                ...state,
                status: SET_SUCCESS,
            };
        }
        default: {
            return state;
        }
    }
}