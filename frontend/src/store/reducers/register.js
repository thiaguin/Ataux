import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    loading: false,
    error: null,
    success: null,
};

const registerStart = (state) => ({
    ...state,
    loading: true,
});

const registerSuccess = (state) => ({
    ...state,
    loading: false,
    success: true,
});

const registerFail = (state, data) => ({
    ...state,
    loading: false,
    error: getErrorMessage(data),
});

const resetRegister = (state) => ({
    ...state,
    ...initialState,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_START:
            return registerStart(state);
        case actionTypes.REGISTER_SUCCESS:
            return registerSuccess(state);
        case actionTypes.REGISTER_FAIL:
            return registerFail(state, action.error.response);
        case actionTypes.RESET_REGISTER:
            return resetRegister(state);
        default:
            return { ...state };
    }
};

export default reducer;
