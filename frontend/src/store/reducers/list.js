import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

const initialState = {
    newQuestion: {
        error: null,
        loading: false,
        data: null,
    },
    create: {
        error: null,
        loading: false,
        listId: null,
    },
    get: {
        error: null,
        loading: false,
        data: null,
    },
    users: {
        error: null,
        loading: false,
        data: null,
    },
    update: {
        error: null,
        loading: false,
        success: false,
    },
};

const existQuestionToListStart = (state) => ({
    ...state,
    newQuestion: {
        ...state.newQuestion,
        loading: true,
    },
});

const existQuestionToListSuccess = (state, data) => ({
    ...state,
    newQuestion: {
        ...state.newQuestion,
        loading: false,
        data,
    },
});

const existQuestionToListFail = (state, data) => ({
    ...state,
    newQuestion: {
        ...state.newQuestion,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetExistQuestionToList = (state) => ({
    ...state,
    newQuestion: { ...initialState.newQuestion },
});

const createListStart = (state) => ({
    ...state,
    create: {
        ...state.create,
        loading: true,
    },
});

const createListSuccess = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        listId: data.id,
    },
});

const createListFail = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetCreateList = (state) => ({
    ...state,
    create: { ...initialState.create },
});

const getListByIdStart = (state) => ({
    ...state,
    get: {
        ...state.get,
        loading: true,
    },
});

const getListByIdSuccess = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        data,
    },
});

const getListByIdFail = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetListById = (state) => ({
    ...state,
    get: { ...initialState.get },
});

const getListUsersStart = (state) => ({
    ...state,
    users: {
        ...state.get,
        loading: true,
    },
});

const getListUsersSuccess = (state, data) => ({
    ...state,
    users: {
        ...state.get,
        loading: false,
        data,
    },
});

const getListUsersFail = (state, data) => ({
    ...state,
    users: {
        ...state.get,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetListUsers = (state) => ({
    ...state,
    users: { ...initialState.users },
});

const updateListStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateListSuccess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
    },
});

const updateListFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetUpdateList = (state) => ({
    ...state,
    update: { ...initialState.update },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.EXIST_QUESTION_TO_LIST_START:
            return existQuestionToListStart(state);
        case actionTypes.EXIST_QUESTION_TO_LIST_SUCCESS:
            return existQuestionToListSuccess(state, action.data);
        case actionTypes.EXIST_QUESTION_TO_LIST_FAIL:
            return existQuestionToListFail(state, action.error.response);
        case actionTypes.RESET_EXIST_QUESTION_TO_LIST:
            return resetExistQuestionToList(state);
        case actionTypes.CREATE_LIST_START:
            return createListStart(state);
        case actionTypes.CREATE_LIST_SUCCESS:
            return createListSuccess(state, action.data);
        case actionTypes.CREATE_LIST_FAIL:
            return createListFail(state, action.error.response);
        case actionTypes.RESET_CREATE_LIST:
            return resetCreateList(state);
        case actionTypes.GET_LIST_BY_ID_START:
            return getListByIdStart(state);
        case actionTypes.GET_LIST_BY_ID_SUCCESS:
            return getListByIdSuccess(state, action.data);
        case actionTypes.GET_LIST_BY_ID_FAIL:
            return getListByIdFail(state, action.error.response);
        case actionTypes.RESET_GET_LIST_BY_ID:
            return resetGetListById(state);
        case actionTypes.GET_LIST_USERS_START:
            return getListUsersStart(state);
        case actionTypes.GET_LIST_USERS_SUCCESS:
            return getListUsersSuccess(state, action.data);
        case actionTypes.GET_LIST_USERS_FAIL:
            return getListUsersFail(state, action.error.response);
        case actionTypes.RESET_GET_LIST_USERS:
            return resetGetListUsers(state);
        case actionTypes.UPDATE_LIST_START:
            return updateListStart(state);
        case actionTypes.UPDATE_LIST_SUCCESS:
            return updateListSuccess(state);
        case actionTypes.UPDATE_LIST_FAIL:
            return updateListFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_LIST:
            return resetUpdateList(state);
        default:
            return { ...state };
    }
};

export default reducer;
