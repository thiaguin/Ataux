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

export const getQuestionById = (id) => (dispatch) => {
    dispatch(getQuestionByIdStart());
    axios
        .get(`/questions/${id}`)
        .then((response) => dispatch(getQuestionByIdSucces(response.data)))
        .catch((error) => dispatch(getQuestionByIdFail(error)));
};
