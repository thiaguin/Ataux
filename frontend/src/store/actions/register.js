import * as actionTypes from './actionTypes';
import axios from '../../axios';

const registerStart = () => ({
    type: actionTypes.REGISTER_START,
});

const registerSucces = (data) => ({
    type: actionTypes.REGISTER_SUCCESS,
    data,
});

const registerFail = (error) => ({
    type: actionTypes.REGISTER_FAIL,
    error,
});

export const resetRegister = () => ({ type: actionTypes.RESET_REGISTER });

export const register = (body) => (dispatch) => {
    dispatch(registerStart());
    axios
        .post('/users', body)
        .then((response) => dispatch(registerSucces(response.data)))
        .catch((error) => dispatch(registerFail(error)));
};
