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
