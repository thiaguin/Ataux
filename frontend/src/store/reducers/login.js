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
    expirationDate: null,
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
    localStorage.setItem('userId', decoded.id);
    localStorage.setItem('name', decoded.name);
    localStorage.setItem('email', decoded.email);

    return {
        ...state,
        loading: false,
        error: null,
        token: data.token,
        userId: decoded.id,
        email: decoded.email,
        name: decoded.name,
        expirationDate,
    };
};

const loginFail = (state, data) => ({
    ...state,
    loading: false,
    error: getErrorMessage(data.entity.toUpperCase(), data.type),
});

const resetLogin = (state) => ({
    ...state,
    ...initialState,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
            return loginStart(state);
        case actionTypes.LOGIN_SUCCESS:
            return loginSucess(state, action.data);
        case actionTypes.LOGIN_FAIL:
            return loginFail(state, action.error.response.data);
        case actionTypes.RESET_LOGIN:
            return resetLogin(state);
        default:
            return { ...state };
    }
};

export default reducer;
