import * as actionTypes from '../actions/actionTypes';
import { getErrorMessage } from '../../services/error';

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
    // update: {
    //     error: null,
    //     loading: false,
    //     success: null,
    // },
};

const sortClass = (data) => {
    const classUsers = data.users.sort((a, b) => (a.user.name.toLowerCase() > b.user.name.toLowerCase() ? 1 : -1));
    const classList = data.lists.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

    // eslint-disable-next-line no-console
    console.log('classUSers', classUsers);
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
        case actionTypes.GET_CLASS_RESUME_START:
            return getClassResumeStart(state);
        case actionTypes.GET_CLASS_RESUME_SUCCESS:
            return getClassResumeSuccess(state, action.data);
        case actionTypes.GET_CLASS_RESUME_FAIL:
            return getClassResumeFail(state, action.error.response);
        case actionTypes.RESET_GET_CLASS_RESUME:
            return resetGetClassResume(state);

        default:
            return { ...state };
    }
};

export default reducer;
