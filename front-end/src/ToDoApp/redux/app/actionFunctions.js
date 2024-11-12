import { SET_LOADING, SET_ERROR, SET_SUCCESS } from './actions';

// Action creators for app state
export const setLoading = () => ({
    type: SET_LOADING
});

export const setError = () => ({
    type: SET_ERROR
});

export const setSuccess = () => ({
    type: SET_SUCCESS
});