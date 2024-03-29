import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const setRedirectPath = (path) => ({
    type: actionTypes.SET_REDIRECT_PATH,
    pathToRedirect: path,
});

const loginStart = (method) => ({
    type: actionTypes.LOGIN_START,
    method,
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
    dispatch(loginStart('LOCAL'));
    axios
        .post('/auth', body)
        .then((response) => dispatch(loginSucces(response.data)))
        .catch((error) => dispatch(loginFail(error)));
};

const authCheckSucces = () => ({
    type: actionTypes.AUTH_CHECK_SUCCESS,
});

export const logout = (hasExpired) => ({
    type: actionTypes.AUTH_LOGOUT,
    hasExpired,
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

export const googleLogin = (body) => (dispatch) => {
    dispatch(loginStart('GOOGLE'));
    axios
        .post('/auth/google', body)
        .then((response) => dispatch(loginSucces(response.data)))
        .catch((error) => dispatch(loginFail(error)));
};

const refreshTokenSucces = (data) => ({
    type: actionTypes.REFRESH_TOKEN_SUCCESS,
    data,
});

export const resetRefreshToken = () => ({ type: actionTypes.RESET_REFRESH_TOKEN });

export const refreshToken = (body) => (dispatch) => {
    axios
        .post('/auth/refresh', body)
        .then((response) => dispatch(refreshTokenSucces(response.data)))
        .catch((error) => dispatch(logout(error)));
};
