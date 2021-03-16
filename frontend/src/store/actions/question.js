import * as actionTypes from './actionTypes';
import axios from '../../axios';

const createQuestionStart = () => ({
    type: actionTypes.CREATE_QUESTION_START,
});

const createQuestionSucces = (data) => ({
    type: actionTypes.CREATE_QUESTION_SUCCESS,
    data,
});

const createQuestionFail = (error) => ({
    type: actionTypes.CREATE_QUESTION_FAIL,
    error,
});

export const resetCreateQuestion = () => ({ type: actionTypes.RESET_CREATE_QUESTION });

export const createQuestion = (body) => (dispatch) => {
    dispatch(createQuestionStart());
    axios
        .post('/questions/contest', body)
        .then((response) => dispatch(createQuestionSucces(response.data)))
        .catch((error) => dispatch(createQuestionFail(error)));
};

const getQuestionByIdStart = () => ({
    type: actionTypes.GET_QUESTION_BY_ID_START,
});

const getQuestionByIdSucces = (data) => ({
    type: actionTypes.GET_QUESTION_BY_ID_SUCCESS,
    data,
});

const getQuestionByIdFail = (error) => ({
    type: actionTypes.GET_QUESTION_BY_ID_FAIL,
    error,
});

export const resetGetQuestionById = () => ({ type: actionTypes.RESET_GET_QUESTION_BY_ID });

export const getQuestionById = (id, token) => (dispatch) => {
    dispatch(getQuestionByIdStart());
    axios
        .get(`/questions/${id}`, { headers: { Authorization: token } })
        .then((response) => dispatch(getQuestionByIdSucces(response.data)))
        .catch((error) => dispatch(getQuestionByIdFail(error)));
};

const updateQuestionStart = () => ({
    type: actionTypes.UPDATE_QUESTION_START,
});

const updateQuestionSucces = () => ({
    type: actionTypes.UPDATE_QUESTION_SUCCESS,
});

const updateQuestionFail = (error) => ({
    type: actionTypes.UPDATE_QUESTION_FAIL,
    error,
});

export const resetUpdateQuestion = () => ({ type: actionTypes.RESET_UPDATE_QUESTION });

export const updateQuestion = ({ id, ...body }) => (dispatch) => {
    dispatch(updateQuestionStart());
    axios
        .put(`/questions/${id}`, body)
        .then(() => dispatch(updateQuestionSucces()))
        .catch((error) => dispatch(updateQuestionFail(error)));
};

const getAllQuestionsStart = () => ({
    type: actionTypes.GET_ALL_QUESTIONS_START,
});

const getAllQuestionsSucces = (data) => ({
    type: actionTypes.GET_ALL_QUESTIONS_SUCCESS,
    data,
});

const getAllQuestionsFail = (error) => ({
    type: actionTypes.GET_ALL_QUESTIONS_FAIL,
    error,
});

export const resetGetAllQuestions = () => ({ type: actionTypes.RESET_GET_ALL_QUESTIONS });

export const getAllQuestions = (query) => (dispatch) => {
    dispatch(getAllQuestionsStart());
    axios
        .get(`/questions`, { params: query })
        .then((response) => dispatch(getAllQuestionsSucces(response.data)))
        .catch((error) => dispatch(getAllQuestionsFail(error)));
};
