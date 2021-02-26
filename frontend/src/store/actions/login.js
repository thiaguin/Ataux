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

const authCheckSucces = () => ({
    type: actionTypes.AUTH_CHECK_SUCCESS,
});

export const logout = () => ({
    type: actionTypes.AUTH_LOGOUT,
});

const authLogoutAsync = (expiresTime) => (dispatch) => {
    setTimeout(() => dispatch(logout()), expiresTime * 1000);
};

export const authCheck = () => (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
        const dateExpiration = localStorage.getItem('expirationDate') || '';
        const expirationDate = new Date(dateExpiration);
        const dateNow = new Date();

        if (expirationDate > dateNow) {
            const expiresIn = (expirationDate.getTime() - dateNow.getTime()) / 1000;
            dispatch(authCheckSucces());
            dispatch(authLogoutAsync(expiresIn));
        } else {
            dispatch(logout());
        }
    } else {
        dispatch(logout());
    }
};

export const setRedirectPath = (path) => ({
    type: actionTypes.SET_REDIRECT_PATH,
    pathToRedirect: path,
});
