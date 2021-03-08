import * as actionTypes from './actionTypes';
import axios from '../../axios';

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

export const getAllClasses = (query) => (dispatch) => {
    dispatch(getAllClassesStart());
    axios
        .get(`/classes`, { params: query })
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

export const getClassResume = (id) => (dispatch) => {
    dispatch(getClassResumeStart());
    axios
        .get(`/classes/${id}`)
        .then((response) => dispatch(getClassResumeSucces(response.data)))
        .catch((error) => dispatch(getClassResumeFail(error)));
};
