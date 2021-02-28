import * as actionTypes from './actionTypes';
import axios from '../../axios';

const recoverPasswordStart = () => ({
    type: actionTypes.RECOVER_PASSWORD_START,
});

const recoverPasswordSucces = (data) => ({
    type: actionTypes.RECOVER_PASSWORD_SUCCESS,
    data,
});

const recoverPasswordFail = (error) => ({
    type: actionTypes.RECOVER_PASSWORD_FAIL,
    error,
});

export const recoverPassword = (body) => (dispatch) => {
    dispatch(recoverPasswordStart());
    axios
        .post('/users/resetPassword', body)
        .then((response) => dispatch(recoverPasswordSucces(response.data)))
        .catch((error) => dispatch(recoverPasswordFail(error)));
};

export const resetRecoverPassword = () => ({ type: actionTypes.RESET_RECOVER_PASSWORD });
