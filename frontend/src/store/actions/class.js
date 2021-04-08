import * as actionTypes from './actionTypes';
import axios from '../../axios';
import { downloadFile, getFileNameFromContentDisposition } from '../../utils/fileUtils';

const getAllClassesStart = () => ({
    type: actionTypes.GET_ALL_CLASSES_START,
});

const getAllClassesSuccess = (data) => ({
    type: actionTypes.GET_ALL_CLASSES_SUCCESS,
    data,
});

const getAllClassesFail = (error) => ({
    type: actionTypes.GET_ALL_CLASSES_FAIL,
    error,
});

export const resetGetAllClasses = () => ({ type: actionTypes.RESET_GET_ALL_CLASSES });

export const getAllClasses = (query, token) => (dispatch) => {
    dispatch(getAllClassesStart());
    axios
        .get(`/classes`, { params: query, headers: { Authorization: token } })
        .then((response) => dispatch(getAllClassesSuccess(response.data)))
        .catch((error) => dispatch(getAllClassesFail(error)));
};

const createClassStart = () => ({
    type: actionTypes.CREATE_CLASS_START,
});

const createClassSuccess = (data) => ({
    type: actionTypes.CREATE_CLASS_SUCCESS,
    data,
});

const createClassFail = (error) => ({
    type: actionTypes.CREATE_CLASS_FAIL,
    error,
});

export const resetCreateClass = () => ({ type: actionTypes.RESET_CREATE_CLASS });

export const createClass = (body, token) => (dispatch) => {
    dispatch(createClassStart());
    axios
        .post('/classes', body, { headers: { Authorization: token } })
        .then((response) => dispatch(createClassSuccess(response.data)))
        .catch((error) => dispatch(createClassFail(error)));
};

const getClassResumeStart = () => ({
    type: actionTypes.GET_CLASS_RESUME_START,
});

const getClassResumeSucces = (data) => ({
    type: actionTypes.GET_CLASS_RESUME_SUCCESS,
    data,
});

const getClassResumeFail = (error) => ({
    type: actionTypes.GET_CLASS_RESUME_FAIL,
    error,
});

export const resetGetClassResume = () => ({ type: actionTypes.RESET_GET_CLASS_RESUME });

export const getClassResume = (id, token) => (dispatch) => {
    dispatch(getClassResumeStart());
    axios
        .get(`/classes/${id}`, { headers: { Authorization: token } })
        .then((response) => dispatch(getClassResumeSucces(response.data)))
        .catch((error) => dispatch(getClassResumeFail(error)));
};

const addUserClassStart = () => ({
    type: actionTypes.ADD_USER_CLASS_START,
});

const addUserClassSuccess = (data) => ({
    type: actionTypes.ADD_USER_CLASS_SUCCESS,
    data,
});

const addUserClassFail = (error) => ({
    type: actionTypes.ADD_USER_CLASS_FAIL,
    error,
});

export const resetAddUserClass = () => ({ type: actionTypes.RESET_ADD_USER_CLASS });

export const addUserClass = ({ classId, ...body }, token) => (dispatch) => {
    dispatch(addUserClassStart());
    axios
        .post(`/classes/${classId}/add/users`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(addUserClassSuccess(response.data)))
        .catch((error) => dispatch(addUserClassFail(error)));
};

const registerClassStart = () => ({
    type: actionTypes.REGISTER_CLASS_START,
});

const registerClassSuccess = (data) => ({
    type: actionTypes.REGISTER_CLASS_SUCCESS,
    data,
});

const registerClassFail = (error) => ({
    type: actionTypes.REGISTER_CLASS_FAIL,
    error,
});

export const resetRegisterClass = () => ({ type: actionTypes.RESET_REGISTER_CLASS });

export const registerClass = (body, token) => (dispatch) => {
    dispatch(registerClassStart());
    axios
        .post('/classes/register', body, { headers: { Authorization: token } })
        .then((response) => dispatch(registerClassSuccess(response.data)))
        .catch((error) => dispatch(registerClassFail(error)));
};

const getCSVClassStart = () => ({
    type: actionTypes.GET_CSV_CLASS_START,
});

const getCSVClassSuccess = () => ({
    type: actionTypes.GET_CSV_CLASS_SUCCESS,
});

const getCSVClassFail = (error) => ({
    type: actionTypes.GET_CSV_CLASS_FAIL,
    error,
});

export const resetGetCSVClass = () => ({ type: actionTypes.RESET_GET_CSV_CLASS });

export const getCSVClass = (id, token) => (dispatch) => {
    dispatch(getCSVClassStart());
    axios
        .get(`/classes/${id}/csv`, { headers: { Authorization: token } })
        .then((response) => {
            downloadFile(
                response.data,
                'csv',
                getFileNameFromContentDisposition(response.headers['content-disposition']),
            );
            dispatch(getCSVClassSuccess());
        })
        .catch((error) => dispatch(getCSVClassFail(error)));
};

const updateClassStart = () => ({
    type: actionTypes.UPDATE_CLASS_START,
});

const updateClassSucces = (data) => ({
    type: actionTypes.UPDATE_CLASS_SUCCESS,
    data,
});

const updateClassFail = (error) => ({
    type: actionTypes.UPDATE_CLASS_FAIL,
    error,
});

export const resetUpdateClass = () => ({ type: actionTypes.RESET_UPDATE_CLASS });

export const updateClass = ({ classId, ...body }, token) => (dispatch) => {
    dispatch(updateClassStart());
    axios
        .put(`/classes/${classId}`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(updateClassSucces(response.data)))
        .catch((error) => dispatch(updateClassFail(error)));
};

const removeClassStart = () => ({
    type: actionTypes.REMOVE_CLASS_START,
});

const removeClassSucces = (data) => ({
    type: actionTypes.REMOVE_CLASS_SUCCESS,
    data,
});

const removeClassFail = (error) => ({
    type: actionTypes.REMOVE_CLASS_FAIL,
    error,
});

export const resetRemoveClass = () => ({ type: actionTypes.RESET_REMOVE_CLASS });

export const removeClass = (classId, token) => (dispatch) => {
    dispatch(removeClassStart());
    axios
        .delete(`/classes/${classId}`, { headers: { Authorization: token } })
        .then((response) => dispatch(removeClassSucces(response.data)))
        .catch((error) => dispatch(removeClassFail(error)));
};

const removeUserClassStart = () => ({
    type: actionTypes.REMOVE_USER_CLASS_START,
});

const removeUserClassSucces = (data) => ({
    type: actionTypes.REMOVE_USER_CLASS_SUCCESS,
    data,
});

const removeUserClassFail = (error) => ({
    type: actionTypes.REMOVE_USER_CLASS_FAIL,
    error,
});

export const resetRemoveUserClass = () => ({ type: actionTypes.RESET_REMOVE_USER_CLASS });

export const removeUserClass = (id, userId, token) => (dispatch) => {
    dispatch(removeUserClassStart());
    axios
        .delete(`/classes/${id}/users/${userId}`, { headers: { Authorization: token } })
        .then((response) => dispatch(removeUserClassSucces(response.data)))
        .catch((error) => dispatch(removeUserClassFail(error)));
};
