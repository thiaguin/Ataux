import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    getAll: {
        error: null,
        loading: false,
        data: null,
    },
    check: {
        error: null,
        loading: false,
        success: false,
    },
};

const getAllSubmissionsStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllSubmissionsSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        data,
    },
});

const getAllSubmissionsFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllSubmissions = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const checkSubmissionsStart = (state) => ({
    ...state,
    check: {
        ...state.check,
        loading: true,
    },
});

const checkSubmissionsSuccess = (state) => ({
    ...state,
    check: {
        ...state.check,
        loading: false,
        success: true,
    },
});

const checkSubmissionsFail = (state, data) => ({
    ...state,
    check: {
        ...state.check,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetCheckSubmissions = (state) => ({
    ...state,
    check: { ...initialState.check },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_SUBMISSIONS_START:
            return getAllSubmissionsStart(state);
        case actionTypes.GET_ALL_SUBMISSIONS_SUCCESS:
            return getAllSubmissionsSuccess(state, action.data);
        case actionTypes.GET_ALL_SUBMISSIONS_FAIL:
            return getAllSubmissionsFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_SUBMISSIONS:
            return resetGetAllSubmissions(state);
        case actionTypes.CHECK_SUBMISSIONS_START:
            return checkSubmissionsStart(state);
        case actionTypes.CHECK_SUBMISSIONS_SUCCESS:
            return checkSubmissionsSuccess(state);
        case actionTypes.CHECK_SUBMISSIONS_FAIL:
            return checkSubmissionsFail(state, action.error.response);
        case actionTypes.RESET_CHECK_SUBMISSIONS:
            return resetCheckSubmissions(state);
        default:
            return { ...state };
    }
};

export default reducer;
