import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    getAll: {
        error: null,
        loading: false,
        data: null,
    },
    // create: {
    //     error: null,
    //     loading: false,
    //     tagId: null,
    // },
    // get: {
    //     error: null,
    //     loading: false,
    //     tag: null,
    // },
    // update: {
    //     error: null,
    //     loading: false,
    //     success: null,
    // },
};

const getAllClassesStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllClassesSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        data,
    },
});

const getAllClassesFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllClasses = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_CLASSES_START:
            return getAllClassesStart(state);
        case actionTypes.GET_ALL_CLASSES_SUCCESS:
            return getAllClassesSuccess(state, action.data);
        case actionTypes.GET_ALL_CLASSES_FAIL:
            return getAllClassesFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_CLASSES:
            return resetGetAllClasses(state);
        default:
            return { ...state };
    }
};

export default reducer;
