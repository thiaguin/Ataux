import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    update: {
        loading: false,
        error: null,
        success: null,
    },
    getAll: {
        loading: false,
        error: null,
        data: null,
    },
    get: {
        loading: false,
        error: null,
        data: null,
    },
    updatePassword: {
        loading: false,
        error: null,
        success: null,
    },
};

const updateUserStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateUserSucess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
        error: null,
    },
});

const updateUserFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: null,
        error: getErrorMessage(data),
    },
});

const resetUpdateUser = (state) => ({
    ...state,
    update: { ...initialState.update },
});

const updateUserPasswordStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateUserPasswordSucess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
        error: null,
    },
});

const updateUserPasswordFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: null,
        error: getErrorMessage(data),
    },
});

const resetUpdateUserPassword = (state) => ({
    ...state,
    update: { ...initialState.update },
});

const getAllUsersStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllUsersSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        data,
    },
});

const getAllUsersFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllUsers = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const getUserByIdStart = (state) => ({
    ...state,
    get: {
        ...state.get,
        loading: true,
    },
});

const getUserByIdSuccess = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        data,
    },
});

const getUserByIdFail = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetUserById = (state) => ({
    ...state,
    ...initialState,
    get: { ...initialState.get },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_USER_START:
            return updateUserStart(state);
        case actionTypes.UPDATE_USER_SUCCESS:
            return updateUserSucess(state);
        case actionTypes.UPDATE_USER_FAIL:
            return updateUserFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_USER:
            return resetUpdateUser(state);
        case actionTypes.UPDATE_USER_PASSWORD_START:
            return updateUserPasswordStart(state);
        case actionTypes.UPDATE_USER_PASSWORD_SUCCESS:
            return updateUserPasswordSucess(state);
        case actionTypes.UPDATE_USER_PASSWORD_FAIL:
            return updateUserPasswordFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_USER_PASSWORD:
            return resetUpdateUserPassword(state);
        case actionTypes.GET_ALL_USERS_START:
            return getAllUsersStart(state);
        case actionTypes.GET_ALL_USERS_SUCCESS:
            return getAllUsersSuccess(state, action.data);
        case actionTypes.GET_ALL_USERS_FAIL:
            return getAllUsersFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_USERS:
            return resetGetAllUsers(state);
        case actionTypes.GET_USER_BY_ID_START:
            return getUserByIdStart(state);
        case actionTypes.GET_USER_BY_ID_SUCCESS:
            return getUserByIdSuccess(state, action.data);
        case actionTypes.GET_USER_BY_ID_FAIL:
            return getUserByIdFail(state, action.error.response);
        case actionTypes.RESET_GET_USER_BY_ID:
            return resetGetUserById(state);
        default:
            return { ...state };
    }
};

export default reducer;
