import * as actionTypes from './actionTypes';
import axios from '../../axios';

const existQuestionToListStart = () => ({
    type: actionTypes.EXIST_QUESTION_TO_LIST_START,
});

const existQuestionToListSucces = (data) => ({
    type: actionTypes.EXIST_QUESTION_TO_LIST_SUCCESS,
    data,
});

const existQuestionToListFail = (error) => ({
    type: actionTypes.EXIST_QUESTION_TO_LIST_FAIL,
    error,
});

export const resetExistQuestionToList = () => ({ type: actionTypes.RESET_EXIST_QUESTION_TO_LIST });

export const existQuestionToList = (url) => (dispatch) => {
    dispatch(existQuestionToListStart());
    axios
        .get('/questions/url', { params: { url } })
        .then((response) => dispatch(existQuestionToListSucces(response.data)))
        .catch((error) => dispatch(existQuestionToListFail(error)));
};

const createListStart = () => ({
    type: actionTypes.CREATE_LIST_START,
});

const createListSuccess = (data) => ({
    type: actionTypes.CREATE_LIST_SUCCESS,
    data,
});

const createListFail = (error) => ({
    type: actionTypes.CREATE_LIST_FAIL,
    error,
});

export const resetCreateList = () => ({ type: actionTypes.RESET_CREATE_LIST });

export const createList = (body) => (dispatch) => {
    dispatch(createListStart());
    axios
        .post('/lists', body)
        .then((response) => dispatch(createListSuccess(response.data)))
        .catch((error) => dispatch(createListFail(error)));
};
