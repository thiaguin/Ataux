import jwt from 'jwt-decode';
import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    loading: false,
    error: null,
    token: null,
    userId: null,
    email: null,
    name: null,
    role: null,
    registration: null,
    handle: null,
    expirationDate: null,
    pathToRedirect: '/',
};

const loginStart = (state) => ({
    ...state,
    loading: true,
    error: null,
});

const loginSucess = (state, data) => {
    const decoded = jwt(data.token);
    const expirationDate = new Date(decoded.exp * 1000);

    localStorage.setItem('token', data.token);
    localStorage.setItem('expirationDate', `${expirationDate}`);

    return {
        ...state,
        loading: false,
        error: null,
        token: data.token,
        userId: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        handle: decoded.handle,
        registration: decoded.registration,
        expirationDate,
    };
};

const loginFail = (state, data) => ({
    ...state,
    loading: false,
    error: getErrorMessage(data),
});

const resetLogin = (state) => ({
    ...state,
    ...initialState,
});

const authSucces = (state) => {
    const token = localStorage.getItem('token');
    const decoded = jwt(token);
    return {
        ...state,
        token,
        userId: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        handle: decoded.handle,
        registration: decoded.registration,
        pathToRedirect: '/',
    };
};

const authLogout = (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');

    return {
        ...state,
        token: null,
        userId: null,
        email: null,
        name: null,
        role: null,
        registration: null,
        expirationDate: null,
        handle: null,
    };
};

const setRedirectPath = (state, action) => ({
    ...state,
    pathToRedirect: action.pathToRedirect,
});

const refreshTokenSuccess = (state, data) => {
    const decoded = jwt(data.token);
    const expirationDate = new Date(decoded.exp * 1000);

    localStorage.setItem('token', data.token);
    localStorage.setItem('expirationDate', `${expirationDate}`);

    return {
        ...state,
        loading: false,
        error: null,
        token: data.token,
        userId: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        handle: decoded.handle,
        registration: decoded.registration,
        expirationDate,
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
            return loginStart(state);
        case actionTypes.LOGIN_SUCCESS:
            return loginSucess(state, action.data);
        case actionTypes.LOGIN_FAIL:
            return loginFail(state, action.error.response);
        case actionTypes.RESET_LOGIN:
            return resetLogin(state);
        case actionTypes.AUTH_CHECK_SUCCESS:
            return authSucces(state);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state);
        case actionTypes.SET_REDIRECT_PATH:
            return setRedirectPath(state, action);
        case actionTypes.REFRESH_TOKEN_SUCCESS:
            return refreshTokenSuccess(state, action.data);
        default:
            return { ...state };
    }
};

export default reducer;
