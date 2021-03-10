import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    newQuestion: {
        error: null,
        loading: false,
        data: null,
    },
    create: {
        error: null,
        loading: false,
        listId: null,
    },
};

const existQuestionToListStart = (state) => ({
    ...state,
    newQuestion: {
        ...state.newQuestion,
        loading: true,
    },
});

const existQuestionToListSuccess = (state, data) => ({
    ...state,
    newQuestion: {
        ...state.newQuestion,
        loading: false,
        data,
    },
});

const existQuestionToListFail = (state, data) => ({
    ...state,
    newQuestion: {
        ...state.newQuestion,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetExistQuestionToList = (state) => ({
    ...state,
    ...initialState,
    newQuestion: { ...initialState.newQuestion },
});

const createListStart = (state) => ({
    ...state,
    create: {
        ...state.create,
        loading: true,
    },
});

const createListSuccess = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        listId: data.id,
    },
});

const createListFail = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetCreateList = (state) => ({
    ...state,
    ...initialState,
    create: { ...initialState.create },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.EXIST_QUESTION_TO_LIST_START:
            return existQuestionToListStart(state);
        case actionTypes.EXIST_QUESTION_TO_LIST_SUCCESS:
            return existQuestionToListSuccess(state, action.data);
        case actionTypes.EXIST_QUESTION_TO_LIST_FAIL:
            return existQuestionToListFail(state, action.error.response);
        case actionTypes.RESET_EXIST_QUESTION_TO_LIST:
            return resetExistQuestionToList(state);
        case actionTypes.CREATE_LIST_START:
            return createListStart(state);
        case actionTypes.CREATE_LIST_SUCCESS:
            return createListSuccess(state, action.data);
        case actionTypes.CREATE_LIST_FAIL:
            return createListFail(state, action.error.response);
        case actionTypes.RESET_CREATE_LIST:
            return resetCreateList(state);
        default:
            return { ...state };
    }
};

export default reducer;
