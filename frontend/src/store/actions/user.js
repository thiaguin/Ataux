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

export const updateUser = ({ userId, token, ...body }) => (dispatch) => {
    dispatch(updateUserStart());
    axios
        .put(`/users/${userId}`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(updateUserSucces(response.data)))
        .catch((error) => dispatch(updateUserFail(error)));
};

export const checkValidMissInfo = (query, token) => (dispatch) => {
    dispatch(updateUserStart());
    axios
        .get(`/users/existHandle`, { params: { handle: query.handle }, headers: { Authorization: token } })
        .then(() => dispatch(updateUser(query)))
        .catch((error) => dispatch(updateUserFail(error)));
};

const getAllUsersStart = () => ({
    type: actionTypes.GET_ALL_USERS_START,
});

const getAllUsersSucces = (data) => ({
    type: actionTypes.GET_ALL_USERS_SUCCESS,
    data,
});

const getAllUsersFail = (error) => ({
    type: actionTypes.GET_ALL_USERS_FAIL,
    error,
});

export const resetGetAllUsers = () => ({ type: actionTypes.RESET_GET_ALL_USERS });

export const getAllUsers = (query = {}, token) => (dispatch) => {
    dispatch(getAllUsersStart());
    axios
        .get(`/users`, { params: query, headers: { Authorization: token } })
        .then((response) => dispatch(getAllUsersSucces(response.data)))
        .catch((error) => dispatch(getAllUsersFail(error)));
};

const getUserByIdStart = () => ({
    type: actionTypes.GET_USER_BY_ID_START,
});

const getUserByIdSucces = (data) => ({
    type: actionTypes.GET_USER_BY_ID_SUCCESS,
    data,
});

const getUserByIdFail = (error) => ({
    type: actionTypes.GET_USER_BY_ID_FAIL,
    error,
});

export const resetGetUserById = () => ({ type: actionTypes.RESET_GET_USER_BY_ID });

export const getUserById = (id, token) => (dispatch) => {
    dispatch(getUserByIdStart());
    axios
        .get(`/users/${id}`, { headers: { Authorization: token } })
        .then((response) => dispatch(getUserByIdSucces(response.data)))
        .catch((error) => dispatch(getUserByIdFail(error)));
};

const updatePasswordUserStart = () => ({
    type: actionTypes.UPDATE_USER_PASSWORD_START,
});

const updatePasswordUserSucces = (data) => ({
    type: actionTypes.UPDATE_USER_PASSWORD_SUCCESS,
    data,
});

const updatePasswordUserFail = (error) => ({
    type: actionTypes.UPDATE_USER_PASSWORD_FAIL,
    error,
});

export const resetUpdatePasswordUser = () => ({ type: actionTypes.RESET_UPDATE_USER_PASSWORD });

export const updatePasswordUser = ({ userId, token, ...body }) => (dispatch) => {
    dispatch(updatePasswordUserStart());
    axios
        .put(`/users/${userId}/resetPassword`, body, { headers: { Authorization: token } })
        .then((response) => dispatch(updatePasswordUserSucces(response.data)))
        .catch((error) => dispatch(updatePasswordUserFail(error)));
};

const removeUserStart = () => ({
    type: actionTypes.REMOVE_USER_START,
});

const removeUserSucces = (data) => ({
    type: actionTypes.REMOVE_USER_SUCCESS,
    data,
});

const removeUserFail = (error) => ({
    type: actionTypes.REMOVE_USER_FAIL,
    error,
});

export const resetRemoveUser = () => ({ type: actionTypes.RESET_REMOVE_USER });

export const removeUser = (id, token) => (dispatch) => {
    dispatch(removeUserStart());
    axios
        .delete(`/users/${id}`, { headers: { Authorization: token } })
        .then((response) => dispatch(removeUserSucces(response.data)))
        .catch((error) => dispatch(removeUserFail(error)));
};
