import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    error: null,
    confirmed: false,
    loading: false,
};

const confirmEmailStart = (state) => ({
    ...state,
    loading: true,
});

const confirmEmailSuccess = (state) => ({
    ...state,
    loading: false,
    confirmed: true,
});

const confirmEmailFail = (state, data) => ({
    ...state,
    loading: false,
    confirmed: false,
    error: getErrorMessage(data),
});

const resetRecoverPassword = (state) => ({
    ...state,
    ...initialState,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CONFIRM_EMAIL_START:
            return confirmEmailStart(state);
        case actionTypes.CONFIRM_EMAIL_SUCCESS:
            return confirmEmailSuccess(state);
        case actionTypes.CONFIRM_EMAIL_FAIL:
            return confirmEmailFail(state, action.error.response);
        case actionTypes.RESET_CONFIRM_EMAIL:
            return resetRecoverPassword(state);
        default:
            return { ...state };
    }
};

export default reducer;
