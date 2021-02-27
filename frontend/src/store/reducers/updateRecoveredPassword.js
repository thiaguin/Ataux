import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    exist: null,
    existLoading: false,
    existError: null,
    success: null,
    updateError: null,
    updated: false,
    loadingUpdate: false,
};

const existCodeToRecoverStart = (state) => ({
    ...state,
    existLoading: true,
});

const existCodeToRecoverSuccess = (state) => ({
    ...state,
    existLoading: false,
    exist: true,
});

const existCodeToRecoverFail = (state, data) => ({
    ...state,
    existLoading: false,
    exist: false,
    existError: getErrorMessage(data),
});

const resetExistCodeToRecover = (state) => ({
    ...state,
    ...initialState,
});

const recoverPasswordStart = (state) => ({
    ...state,
    loadingUpdate: true,
});

const recoverPasswordSuccess = (state) => ({
    ...state,
    loadingUpdate: false,
    updated: true,
});

const recoverPasswordFail = (state, data) => ({
    ...state,
    loadingUpdate: false,
    updated: false,
    updateError: getErrorMessage(data),
});

const resetRecoverPassword = (state) => ({
    ...state,
    ...initialState,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.EXIST_CODE_TO_RECOVER_START:
            return existCodeToRecoverStart(state);
        case actionTypes.EXIST_CODE_TO_RECOVER_SUCCESS:
            return existCodeToRecoverSuccess(state);
        case actionTypes.EXIST_CODE_TO_RECOVER_FAIL:
            return existCodeToRecoverFail(state, action.error.response);
        case actionTypes.RESET_EXIST_CODE_TO_RECOVER:
            return resetExistCodeToRecover(state);
        case actionTypes.UPDATE_RECOVERED_PASSWORD_START:
            return recoverPasswordStart(state);
        case actionTypes.UPDATE_RECOVERED_PASSWORD_SUCCESS:
            return recoverPasswordSuccess(state);
        case actionTypes.UPDATE_RECOVERED_PASSWORD_FAIL:
            return recoverPasswordFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_RECOVERED_PASSWORD:
            return resetRecoverPassword(state);
        default:
            return { ...state };
    }
};

export default reducer;
