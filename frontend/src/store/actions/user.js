import * as actionTypes from './actionTypes';
import axios from '../../axios';

const updateUserStart = () => ({
    type: actionTypes.UPDATE_USER_START,
});

const updateUserSucces = (data) => ({
    type: actionTypes.UPDATE_USER_SUCCESS,
    data,
});

const updateUserFail = (error) => ({
    type: actionTypes.UPDATE_USER_FAIL,
    error,
});

export const resetUpdateUser = () => ({ type: actionTypes.RESET_UPDATE_USER });

export const updateUser = ({ userId, ...body }) => (dispatch) => {
    dispatch(updateUserStart());
    axios
        .put(`/users/${userId}`, body)
        .then((response) => dispatch(updateUserSucces(response.data)))
        .catch((error) => dispatch(updateUserFail(error)));
};

export const checkValidMissInfo = (query) => (dispatch) => {
    dispatch(updateUserStart());
    axios
        .get(`/users/existHandle`, { params: { handle: query.handle } })
        .then(() => dispatch(updateUser(query)))
        .catch((error) => dispatch(updateUserFail(error)));
};
