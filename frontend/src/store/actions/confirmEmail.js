import * as actionTypes from './actionTypes';
import axios from '../../axios';

const confirmEmailStart = () => ({
    type: actionTypes.CONFIRM_EMAIL_START,
});

const confirmEmailSucces = () => ({
    type: actionTypes.CONFIRM_EMAIL_SUCCESS,
});

const confirmEmailFail = (error) => ({
    type: actionTypes.CONFIRM_EMAIL_FAIL,
    error,
});

export const resetConfirmEmail = () => ({ type: actionTypes.RESET_CONFIRM_EMAIL });

export const confirmEmail = (body) => (dispatch) => {
    dispatch(confirmEmailStart());
    axios
        .post('/users/confirm', body)
        .then(() => dispatch(confirmEmailSucces()))
        .catch((error) => dispatch(confirmEmailFail(error)));
};

const resendEmailStart = () => ({
    type: actionTypes.RESEND_EMAIL_START,
});

const resendEmailSucces = () => ({
    type: actionTypes.RESEND_EMAIL_SUCCESS,
});

const resendEmailFail = (error) => ({
    type: actionTypes.RESEND_EMAIL_FAIL,
    error,
});

export const resetResendEmail = () => ({ type: actionTypes.RESET_RESEND_EMAIL });

export const resendEmail = (body) => (dispatch) => {
    dispatch(resendEmailStart());
    axios
        .post('/users/resendEmail', body)
        .then(() => dispatch(resendEmailSucces()))
        .catch((error) => dispatch(resendEmailFail(error)));
};
