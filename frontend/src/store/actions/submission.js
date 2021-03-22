import * as actionTypes from './actionTypes';
import axios from '../../axios';

const getAllSubmissionsStart = () => ({
    type: actionTypes.GET_ALL_SUBMISSIONS_START,
});

const getAllSubmissionsSucces = (data) => ({
    type: actionTypes.GET_ALL_SUBMISSIONS_SUCCESS,
    data,
});

const getAllSubmissionsFail = (error) => ({
    type: actionTypes.GET_ALL_SUBMISSIONS_FAIL,
    error,
});

export const resetGetAllSubmissions = () => ({ type: actionTypes.RESET_GET_ALL_SUBMISSIONS });

export const getAllSubmissions = (query, token) => (dispatch) => {
    dispatch(getAllSubmissionsStart());
    axios
        .get(`/submissions`, { params: query, headers: { Authorization: token } })
        .then((response) => dispatch(getAllSubmissionsSucces(response.data)))
        .catch((error) => dispatch(getAllSubmissionsFail(error)));
};

const getSubmissionByIdStart = () => ({
    type: actionTypes.GET_SUBMISSION_BY_ID_START,
});

const getSubmissionByIdSucces = (data) => ({
    type: actionTypes.GET_SUBMISSION_BY_ID_SUCCESS,
    data,
});

const getSubmissionByIdFail = (error) => ({
    type: actionTypes.GET_SUBMISSION_BY_ID_FAIL,
    error,
});

export const resetGetSubmissionById = () => ({ type: actionTypes.RESET_GET_SUBMISSION_BY_ID });

export const getSubmissionById = (id, token) => (dispatch) => {
    dispatch(getSubmissionByIdStart());
    axios
        .get(`/submissions/${id}`, { headers: { Authorization: token } })
        .then((response) => dispatch(getSubmissionByIdSucces(response.data)))
        .catch((error) => dispatch(getSubmissionByIdFail(error)));
};

const checkSubmissionStart = () => ({
    type: actionTypes.CHECK_SUBMISSIONS_START,
});

const checkSubmissionSuccess = (data) => ({
    type: actionTypes.CHECK_SUBMISSIONS_SUCCESS,
    data,
});

const checkSubmissionFail = (error) => ({
    type: actionTypes.CHECK_SUBMISSIONS_FAIL,
    error,
});

export const resetCheckSubmssions = () => ({ type: actionTypes.RESET_CHECK_SUBMISSIONS });

export const checkSubmission = ({ listId, body, token }) => (dispatch) => {
    dispatch(checkSubmissionStart());
    axios
        .post(`/lists/${listId}/questions/submissions`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(checkSubmissionSuccess(response.data)))
        .catch((error) => dispatch(checkSubmissionFail(error)));
};

export const checkAllUsersSubmissions = (id, token, body = {}) => (dispatch) => {
    dispatch(checkSubmissionStart());
    axios
        .post(`/lists/${id}/users/submissions`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(checkSubmissionSuccess(response.data)))
        .catch((error) => dispatch(checkSubmissionFail(error)));
};
