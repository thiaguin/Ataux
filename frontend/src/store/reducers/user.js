import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    update: {
        loading: false,
        error: null,
        success: null,
    },
};

const updateUserStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateUserSucess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
        error: null,
    },
});

const updateUserFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: null,
        error: getErrorMessage(data),
    },
});

const resetUpdateUser = (state) => ({
    ...state,
    update: { ...initialState.update },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_USER_START:
            return updateUserStart(state);
        case actionTypes.UPDATE_USER_SUCCESS:
            return updateUserSucess(state);
        case actionTypes.UPDATE_USER_FAIL:
            return updateUserFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_USER:
            return resetUpdateUser(state);
        default:
            return { ...state };
    }
};

export default reducer;
