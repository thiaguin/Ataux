import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    create: {
        error: null,
        loading: false,
        questionId: null,
    },
    get: {
        error: null,
        loading: false,
        question: null,
    },
};

const createQuestionStart = (state) => ({
    ...state,
    create: {
        ...state.create,
        loading: true,
    },
});

const createQuestionSuccess = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        questionId: !data.question.error ? data.question.questionId : null,
        error: data.question.error ? getErrorMessage({ data: data.question.error }) : null,
    },
});

const createQuestionFail = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetCreateQuestion = (state) => ({
    ...state,
    ...initialState,
    create: { ...initialState.create },
});

const getQuestionByIdStart = (state) => ({
    ...state,
    get: {
        ...state.get,
        loading: true,
    },
});

const getQuestionByIdSuccess = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        question: data,
    },
});

const getQuestionByIdFail = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetQuestionById = (state) => ({
    ...state,
    ...initialState,
    get: { ...initialState.get },
});

const reducer = (state = initialState, action) => {
    // eslint-disable-next-line no-console
    console.log('action', action.type);
    switch (action.type) {
        case actionTypes.CREATE_QUESTION_START:
            return createQuestionStart(state);
        case actionTypes.CREATE_QUESTION_SUCCESS:
            return createQuestionSuccess(state, action.data);
        case actionTypes.CREATE_QUESTION_FAIL:
            return createQuestionFail(state, action.error.response);
        case actionTypes.RESET_CREATE_QUESTION:
            return resetCreateQuestion(state);
        case actionTypes.GET_QUESTION_BY_ID_START:
            return getQuestionByIdStart(state);
        case actionTypes.GET_QUESTION_BY_ID_SUCCESS:
            return getQuestionByIdSuccess(state, action.data);
        case actionTypes.GET_QUESTION_BY_ID_FAIL:
            return getQuestionByIdFail(state, action.error.response);
        case actionTypes.RESET_GET_QUESTION_BY_ID:
            return resetGetQuestionById(state);
        default:
            return { ...state };
    }
};

export default reducer;
