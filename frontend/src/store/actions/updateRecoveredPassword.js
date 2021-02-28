import * as actionTypes from './actionTypes';
import axios from '../../axios';

const existCodeToRecoverStart = () => ({
    type: actionTypes.EXIST_CODE_TO_RECOVER_START,
});

const existCodeToRecoverSucces = () => ({
    type: actionTypes.EXIST_CODE_TO_RECOVER_SUCCESS,
});

const existCodeToRecoverFail = (error) => ({
    type: actionTypes.EXIST_CODE_TO_RECOVER_FAIL,
    error,
});

export const resetExistCodeToRecoverPassword = () => ({ type: actionTypes.RESET_EXIST_CODE_TO_RECOVER });

export const existCodeToRecover = (code) => (dispatch) => {
    dispatch(existCodeToRecoverStart());
    axios
        .get(`/users/resetPassword/${code}`)
        .then(() => dispatch(existCodeToRecoverSucces()))
        .catch((error) => dispatch(existCodeToRecoverFail(error)));
};

const updateRecoverPasswordStart = () => ({
    type: actionTypes.UPDATE_RECOVERED_PASSWORD_START,
});

const updateRecoverPasswordSucces = () => ({
    type: actionTypes.UPDATE_RECOVERED_PASSWORD_SUCCESS,
});

const updateRecoverPasswordFail = (error) => ({
    type: actionTypes.UPDATE_RECOVERED_PASSWORD_FAIL,
    error,
});

export const resetUpdateRecoverPassword = () => ({ type: actionTypes.RESET_UPDATE_RECOVERED_PASSWORD });

export const updateRecoverPassword = (body) => (dispatch) => {
    dispatch(updateRecoverPasswordStart());
    axios
        .put('/users/resetPassword', body)
        .then(() => dispatch(updateRecoverPasswordSucces()))
        .catch((error) => dispatch(updateRecoverPasswordFail(error)));
};
