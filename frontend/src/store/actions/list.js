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

const getListByIdStart = () => ({
    type: actionTypes.GET_LIST_BY_ID_START,
});

const getListByIdSucces = (data) => ({
    type: actionTypes.GET_LIST_BY_ID_SUCCESS,
    data,
});

const getListByIdFail = (error) => ({
    type: actionTypes.GET_LIST_BY_ID_FAIL,
    error,
});

export const resetGetListById = () => ({ type: actionTypes.RESET_GET_LIST_BY_ID });

export const getListById = (id) => (dispatch) => {
    dispatch(getListByIdStart());
    axios
        .get(`/lists/${id}`)
        .then((response) => dispatch(getListByIdSucces(response.data)))
        .catch((error) => dispatch(getListByIdFail(error)));
};

const getListUsersStart = () => ({
    type: actionTypes.GET_LIST_USERS_START,
});

const getListUsersSucces = (data) => ({
    type: actionTypes.GET_LIST_USERS_SUCCESS,
    data,
});

const getListUsersFail = (error) => ({
    type: actionTypes.GET_LIST_USERS_FAIL,
    error,
});

export const resetGetListUsers = () => ({ type: actionTypes.RESET_GET_LIST_USERS });

export const getListUsers = (id) => (dispatch) => {
    dispatch(getListUsersStart());
    axios
        .get(`/lists/${id}/users`)
        .then((response) => dispatch(getListUsersSucces(response.data)))
        .catch((error) => dispatch(getListUsersFail(error)));
};

const updateListStart = () => ({
    type: actionTypes.UPDATE_LIST_START,
});

const updateListSuccess = (data) => ({
    type: actionTypes.UPDATE_LIST_SUCCESS,
    data,
});

const updateListFail = (error) => ({
    type: actionTypes.UPDATE_LIST_FAIL,
    error,
});

export const resetUpdateList = () => ({ type: actionTypes.RESET_UPDATE_LIST });

export const updateList = (id, body) => (dispatch) => {
    dispatch(updateListStart());
    axios
        .put(`/lists/${id}`, body)
        .then((response) => dispatch(updateListSuccess(response.data)))
        .catch((error) => dispatch(updateListFail(error)));
};
