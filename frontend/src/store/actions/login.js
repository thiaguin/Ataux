import * as actionTypes from './actionTypes';
import axios from '../../axios';

const loginStart = () => ({
    type: actionTypes.LOGIN_START,
});

const loginSucces = (data) => ({
    type: actionTypes.LOGIN_SUCCESS,
    data,
});

const loginFail = (error) => ({
    type: actionTypes.LOGIN_FAIL,
    error,
});

export const resetLogin = () => ({ type: actionTypes.RESET_LOGIN });

export const login = (body) => (dispatch) => {
    dispatch(loginStart());
    axios
        .post('/auth', body)
        .then((response) => dispatch(loginSucces(response.data)))
        .catch((error) => dispatch(loginFail(error)));
};
