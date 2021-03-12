import * as actionTypes from './actionTypes';
import axios from '../../axios';

const getAllSubmsssionsStart = () => ({
    type: actionTypes.GET_ALL_SUBMISSIONS_START,
});

const getAllSubmsssionsSucces = (data) => ({
    type: actionTypes.GET_ALL_SUBMISSIONS_SUCCESS,
    data,
});

const getAllSubmsssionsFail = (error) => ({
    type: actionTypes.GET_ALL_SUBMISSIONS_FAIL,
    error,
});

export const resetGetAllSubmsssions = () => ({ type: actionTypes.RESET_GET_ALL_SUBMISSIONS });

export const getAllSubmsssions = (query, token) => (dispatch) => {
    // eslint-disable-next-line no-console
    console.log('query', query);
    dispatch(getAllSubmsssionsStart());
    axios
        .get(`/submissions`, { params: query, headers: { Authorization: token } })
        .then((response) => dispatch(getAllSubmsssionsSucces(response.data)))
        .catch((error) => dispatch(getAllSubmsssionsFail(error)));
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
