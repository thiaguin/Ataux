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

export const getAllUsers = (query = {}) => (dispatch) => {
    dispatch(getAllUsersStart());
    axios
        .get(`/users`, { params: query })
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

export const getUserById = (id) => (dispatch) => {
    dispatch(getUserByIdStart());
    axios
        .get(`/users/${id}`)
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

export const updatePasswordUser = ({ userId, ...body }) => (dispatch) => {
    dispatch(updatePasswordUserStart());
    axios
        .put(`/users/${userId}/resetPassword`, body)
        .then((response) => dispatch(updatePasswordUserSucces(response.data)))
        .catch((error) => dispatch(updatePasswordUserFail(error)));
};
