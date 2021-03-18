import * as actionTypes from './actionTypes';
import axios from '../../axios';
import { downloadFile, getFileNameFromContentDisposition } from '../../utils/fileUtils';

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

export const existQuestionToList = (url, token) => (dispatch) => {
    dispatch(existQuestionToListStart());
    axios
        .get('/questions/url', { params: { url }, headers: { Authorization: token } })
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

export const createList = (body, token) => (dispatch) => {
    dispatch(createListStart());
    axios
        .post('/lists', body, { headers: { Authorization: token } })
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

export const getListById = (id, token) => (dispatch) => {
    dispatch(getListByIdStart());
    axios
        .get(`/lists/${id}`, { headers: { Authorization: token } })
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

export const getListUsers = (id, token) => (dispatch) => {
    dispatch(getListUsersStart());
    axios
        .get(`/lists/${id}/users`, { headers: { Authorization: token } })
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

export const updateList = (id, body, token) => (dispatch) => {
    dispatch(updateListStart());
    axios
        .put(`/lists/${id}`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(updateListSuccess(response.data)))
        .catch((error) => dispatch(updateListFail(error)));
};

const getListCSVStart = () => ({
    type: actionTypes.GET_LIST_CSV_START,
});

const getListCSVSucces = (data) => ({
    type: actionTypes.GET_LIST_CSV_SUCCESS,
    data,
});

const getListCSVFail = (error) => ({
    type: actionTypes.GET_LIST_CSV_FAIL,
    error,
});

export const resetGetListCSV = () => ({ type: actionTypes.RESET_GET_LIST_CSV });

export const getListCSV = (id, token) => (dispatch) => {
    dispatch(getListCSVStart());
    axios
        .get(`/lists/${id}/csv`, { headers: { Authorization: token } })
        .then((response) => {
            downloadFile(
                response.data,
                'csv',
                getFileNameFromContentDisposition(response.headers['content-disposition']),
            );
            dispatch(getListCSVSucces(response.data));
        })
        .catch((error) => dispatch(getListCSVFail(error)));
};

const removeListStart = () => ({
    type: actionTypes.REMOVE_LIST_START,
});

const removeListSuccess = (data) => ({
    type: actionTypes.REMOVE_LIST_SUCCESS,
    data,
});

const removeListFail = (error) => ({
    type: actionTypes.REMOVE_LIST_FAIL,
    error,
});

export const resetRemoveList = () => ({ type: actionTypes.RESET_REMOVE_LIST });

export const removeList = (id, token) => (dispatch) => {
    dispatch(removeListStart());
    axios
        .delete(`/lists/${id}`, { headers: { Authorization: token } })
        .then((response) => dispatch(removeListSuccess(response.data)))
        .catch((error) => dispatch(removeListFail(error)));
};
