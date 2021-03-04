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
    update: {
        error: null,
        loading: false,
        success: null,
    },
    getAll: {
        error: null,
        loading: false,
        questions: null,
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

const getAllQuestionsStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllQuestionsSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        questions: data,
    },
});

const getAllQuestionsFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllQuestions = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const updateQuestionStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateQuestionSuccess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
    },
});

const updateQuestionFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetUpdateQuestion = (state) => ({
    ...state,
    ...initialState,
    update: { ...initialState.update },
});

const reducer = (state = initialState, action) => {
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
        case actionTypes.GET_ALL_QUESTIONS_START:
            return getAllQuestionsStart(state);
        case actionTypes.GET_ALL_QUESTIONS_SUCCESS:
            return getAllQuestionsSuccess(state, action.data);
        case actionTypes.GET_ALL_QUESTIONS_FAIL:
            return getAllQuestionsFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_QUESTIONS:
            return resetGetAllQuestions(state);
        case actionTypes.UPDATE_QUESTION_START:
            return updateQuestionStart(state);
        case actionTypes.UPDATE_QUESTION_SUCCESS:
            return updateQuestionSuccess(state, action.data);
        case actionTypes.UPDATE_QUESTION_FAIL:
            return updateQuestionFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_QUESTION:
            return resetUpdateQuestion(state);
        default:
            return { ...state };
    }
};

export default reducer;
