import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../utils/errorUtils';

const initialState = {
    getAll: {
        error: null,
        loading: false,
        data: null,
    },
    create: {
        error: null,
        loading: false,
        classId: null,
    },
    get: {
        error: null,
        loading: false,
        data: null,
    },
    update: {
        error: null,
        loading: false,
        success: null,
    },
    remove: {
        error: null,
        loading: false,
        success: null,
    },
    removeUser: {
        error: null,
        loading: false,
        success: null,
    },
    addUser: {
        error: null,
        loading: false,
        success: null,
    },
    register: {
        error: null,
        loading: false,
        success: null,
    },
    csv: {
        error: null,
        loading: false,
        success: false,
    },
};

const sortClass = (data) => {
    const classUsers = data.users.sort((a, b) => (a.user.name.toLowerCase() > b.user.name.toLowerCase() ? 1 : -1));
    const classList = data.lists.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

    return {
        ...data,
        users: classUsers,
        lists: classList,
    };
};

const getAllClassesStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllClassesSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        data,
    },
});

const getAllClassesFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllClasses = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const createClassStart = (state) => ({
    ...state,
    create: {
        ...state.create,
        loading: true,
    },
});

const createClassSuccess = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        classId: data.id,
        error: null,
    },
});

const createClassFail = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetCreateClass = (state) => ({
    ...state,
    ...initialState,
    create: { ...initialState.create },
});

const registerClassStart = (state) => ({
    ...state,
    register: {
        ...state.register,
        loading: true,
    },
});

const registerClassSuccess = (state) => ({
    ...state,
    register: {
        ...state.register,
        loading: false,
        success: true,
    },
});

const registerClassFail = (state, data) => ({
    ...state,
    register: {
        ...state.register,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetRegisterClass = (state) => ({
    ...state,
    ...initialState,
    register: { ...initialState.register },
});

const addUserClassStart = (state) => ({
    ...state,
    addUser: {
        ...state.addUser,
        loading: true,
    },
});

const addUserClassSuccess = (state) => ({
    ...state,
    addUser: {
        ...state.addUser,
        loading: false,
        success: true,
    },
});

const addUserClassFail = (state, data) => ({
    ...state,
    addUser: {
        ...state.addUser,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetAddUser = (state) => ({
    ...state,
    ...initialState,
    addUser: { ...initialState.addUser },
});

const getClassResumeStart = (state) => ({
    ...state,
    get: {
        ...state.get,
        loading: true,
    },
});

const getClassResumeSuccess = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        data: sortClass(data),
    },
});

const getClassResumeFail = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetClassResume = (state) => ({
    ...state,
    ...initialState,
    get: { ...initialState.get },
});

const getCsvClassStart = (state) => ({
    ...state,
    csv: {
        ...state.csv,
        loading: true,
    },
});

const getCsvClassSuccess = (state) => ({
    ...state,
    csv: {
        ...state.csv,
        loading: false,
        success: true,
    },
});

const getCsvClassFail = (state, data) => ({
    ...state,
    csv: {
        ...state.csv,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetCsvClass = (state) => ({
    ...state,
    ...initialState,
    csv: { ...initialState.csv },
});

const updateClassStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateClassSuccess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
    },
});

const updateClassFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetUpdateClass = (state) => ({
    ...state,
    ...initialState,
    update: { ...initialState.update },
});

const removeClassStart = (state) => ({
    ...state,
    remove: {
        ...state.remove,
        loading: true,
    },
});

const removeClassSuccess = (state) => ({
    ...state,
    remove: {
        ...state.remove,
        loading: false,
        success: true,
    },
});

const removeClassFail = (state, data) => ({
    ...state,
    remove: {
        ...state.remove,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetRemoveClass = (state) => ({
    ...state,
    ...initialState,
    remove: { ...initialState.remove },
});

const removeUserClassStart = (state) => ({
    ...state,
    removeUser: {
        ...state.removeUser,
        loading: true,
    },
});

const removeUserClassSuccess = (state) => ({
    ...state,
    removeUser: {
        ...state.removeUser,
        loading: false,
        success: true,
    },
});

const removeUserClassFail = (state, data) => ({
    ...state,
    removeUser: {
        ...state.removeUser,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetRemoveUserClass = (state) => ({
    ...state,
    ...initialState,
    removeUser: { ...initialState.removeUser },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_CLASSES_START:
            return getAllClassesStart(state);
        case actionTypes.GET_ALL_CLASSES_SUCCESS:
            return getAllClassesSuccess(state, action.data);
        case actionTypes.GET_ALL_CLASSES_FAIL:
            return getAllClassesFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_CLASSES:
            return resetGetAllClasses(state);
        case actionTypes.CREATE_CLASS_START:
            return createClassStart(state);
        case actionTypes.CREATE_CLASS_SUCCESS:
            return createClassSuccess(state, action.data);
        case actionTypes.CREATE_CLASS_FAIL:
            return createClassFail(state, action.error.response);
        case actionTypes.RESET_CREATE_CLASS:
            return resetCreateClass(state);
        case actionTypes.REGISTER_CLASS_START:
            return registerClassStart(state);
        case actionTypes.REGISTER_CLASS_SUCCESS:
            return registerClassSuccess(state, action.data);
        case actionTypes.REGISTER_CLASS_FAIL:
            return registerClassFail(state, action.error.response);
        case actionTypes.RESET_REGISTER_CLASS:
            return resetRegisterClass(state);
        case actionTypes.ADD_USER_CLASS_START:
            return addUserClassStart(state);
        case actionTypes.ADD_USER_CLASS_SUCCESS:
            return addUserClassSuccess(state, action.data);
        case actionTypes.ADD_USER_CLASS_FAIL:
            return addUserClassFail(state, action.error.response);
        case actionTypes.RESET_ADD_USER_CLASS:
            return resetAddUser(state);
        case actionTypes.GET_CLASS_RESUME_START:
            return getClassResumeStart(state);
        case actionTypes.GET_CLASS_RESUME_SUCCESS:
            return getClassResumeSuccess(state, action.data);
        case actionTypes.GET_CLASS_RESUME_FAIL:
            return getClassResumeFail(state, action.error.response);
        case actionTypes.RESET_GET_CLASS_RESUME:
            return resetGetClassResume(state);
        case actionTypes.UPDATE_CLASS_START:
            return updateClassStart(state);
        case actionTypes.UPDATE_CLASS_SUCCESS:
            return updateClassSuccess(state, action.data);
        case actionTypes.UPDATE_CLASS_FAIL:
            return updateClassFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_CLASS:
            return resetUpdateClass(state);
        case actionTypes.REMOVE_CLASS_START:
            return removeClassStart(state);
        case actionTypes.REMOVE_CLASS_SUCCESS:
            return removeClassSuccess(state, action.data);
        case actionTypes.REMOVE_CLASS_FAIL:
            return removeClassFail(state, action.error.response);
        case actionTypes.RESET_REMOVE_CLASS:
            return resetRemoveClass(state);
        case actionTypes.REMOVE_USER_CLASS_START:
            return removeUserClassStart(state);
        case actionTypes.REMOVE_USER_CLASS_SUCCESS:
            return removeUserClassSuccess(state, action.data);
        case actionTypes.REMOVE_USER_CLASS_FAIL:
            return removeUserClassFail(state, action.error.response);
        case actionTypes.RESET_REMOVE_USER_CLASS:
            return resetRemoveUserClass(state);
        case actionTypes.GET_CSV_CLASS_START:
            return getCsvClassStart(state);
        case actionTypes.GET_CSV_CLASS_SUCCESS:
            return getCsvClassSuccess(state);
        case actionTypes.GET_CSV_CLASS_FAIL:
            return getCsvClassFail(state, action.error.response);
        case actionTypes.RESET_GET_CSV_CLASS:
            return resetGetCsvClass(state);
        default:
            return { ...state };
    }
};

export default reducer;
