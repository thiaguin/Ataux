import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    loading: false,
    error: null,
    success: null,
};

const recoverPasswordStart = (state) => ({
    ...state,
    loading: true,
});

const recoverPasswordSuccess = (state) => ({
    ...state,
    success: true,
    error: null,
});

const recoverPasswordFail = (state, data) => ({
    ...state,
    error: getErrorMessage(data),
    success: null,
});

const resetRecoverPassword = (state) => ({
    ...state,
    ...initialState,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RECOVER_PASSWORD_START:
            return recoverPasswordStart(state);
        case actionTypes.RECOVER_PASSWORD_SUCCESS:
            return recoverPasswordSuccess(state);
        case actionTypes.RECOVER_PASSWORD_FAIL:
            return recoverPasswordFail(state, action.error.response);
        case actionTypes.RESET_RECOVER_PASSWORD:
            return resetRecoverPassword(state);
        default:
            return { ...state };
    }
};

export default reducer;
