import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    getAll: {
        error: null,
        loading: false,
        data: null,
    },
};

const getAllTagsStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllTagsSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        data,
    },
});

const getAllTagsFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllTags = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_TAGS_START:
            return getAllTagsStart(state);
        case actionTypes.GET_ALL_TAGS_SUCCESS:
            return getAllTagsSuccess(state, action.data);
        case actionTypes.GET_ALL_TAGS_FAIL:
            return getAllTagsFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_TAGS:
            return resetGetAllTags(state);
        default:
            return { ...state };
    }
};

export default reducer;
