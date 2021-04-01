import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../utils/errorUtils';

const initialState = {
    error: null,
    confirmed: false,
    loading: false,
    resendLoading: false,
    resended: false,
    resendError: null,
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

const resetConfirmEmail = (state) => ({
    ...state,
    ...initialState,
});

const resendEmailStart = (state) => ({
    ...state,
    resendLoading: true,
});

const resendEmailSuccess = (state) => ({
    ...state,
    resendLoading: false,
    resended: true,
});

const resendEmailFail = (state, data) => ({
    ...state,
    resendLoading: false,
    resended: false,
    resendError: getErrorMessage(data),
});

const resetResendEmail = (state) => ({
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
            return resetConfirmEmail(state);
        case actionTypes.RESEND_EMAIL_START:
            return resendEmailStart(state);
        case actionTypes.RESEND_EMAIL_SUCCESS:
            return resendEmailSuccess(state);
        case actionTypes.RESEND_EMAIL_FAIL:
            return resendEmailFail(state, action.error.response);
        case actionTypes.RESET_RESEND_EMAIL:
            return resetResendEmail(state);
        default:
            return { ...state };
    }
};

export default reducer;
