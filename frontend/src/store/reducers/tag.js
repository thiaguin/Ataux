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
        tagId: null,
    },
    get: {
        error: null,
        loading: false,
        tag: null,
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
};

const getAllTagsStart = (state) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: true,
    },
});

const getAllTagsSuccess = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        data,
    },
});

const getAllTagsFail = (state, data) => ({
    ...state,
    getAll: {
        ...state.getAll,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetAllTags = (state) => ({
    ...state,
    ...initialState,
    getAll: { ...initialState.getAll },
});

const createTagStart = (state) => ({
    ...state,
    create: {
        ...state.create,
        loading: true,
    },
});

const createTagSuccess = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        tagId: data.id,
        error: null,
    },
});

const createTagFail = (state, data) => ({
    ...state,
    create: {
        ...state.create,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetCreateTag = (state) => ({
    ...state,
    ...initialState,
    create: { ...initialState.create },
});

const getTagByIdStart = (state) => ({
    ...state,
    get: {
        ...state.get,
        loading: true,
    },
});

const getTagByIdSuccess = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        tag: data,
    },
});

const getTagByIdFail = (state, data) => ({
    ...state,
    get: {
        ...state.get,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetGetTagById = (state) => ({
    ...state,
    ...initialState,
    get: { ...initialState.get },
});

const updateTagStart = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: true,
    },
});

const updateTagSuccess = (state) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        success: true,
    },
});

const updateTagFail = (state, data) => ({
    ...state,
    update: {
        ...state.update,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetUpdateTag = (state) => ({
    ...state,
    ...initialState,
    update: { ...initialState.update },
});

const removeTagStart = (state) => ({
    ...state,
    remove: {
        ...state.remove,
        loading: true,
    },
});

const removeTagSuccess = (state) => ({
    ...state,
    remove: {
        ...state.remove,
        loading: false,
        success: true,
    },
});

const removeTagFail = (state, data) => ({
    ...state,
    remove: {
        ...state.remove,
        loading: false,
        error: getErrorMessage(data),
    },
});

const resetRemoveTag = (state) => ({
    ...state,
    ...initialState,
    remove: { ...initialState.remove },
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_TAGS_START:
            return getAllTagsStart(state);
        case actionTypes.GET_ALL_TAGS_SUCCESS:
            return getAllTagsSuccess(state, action.data);
        case actionTypes.GET_ALL_TAGS_FAIL:
            return getAllTagsFail(state, action.error.response);
        case actionTypes.RESET_GET_ALL_TAGS:
            return resetGetAllTags(state);
        case actionTypes.CREATE_TAG_START:
            return createTagStart(state);
        case actionTypes.CREATE_TAG_SUCCESS:
            return createTagSuccess(state, action.data);
        case actionTypes.CREATE_TAG_FAIL:
            return createTagFail(state, action.error.response);
        case actionTypes.RESET_CREATE_TAG:
            return resetCreateTag(state);
        case actionTypes.GET_TAG_BY_ID_START:
            return getTagByIdStart(state);
        case actionTypes.GET_TAG_BY_ID_SUCCESS:
            return getTagByIdSuccess(state, action.data);
        case actionTypes.GET_TAG_BY_ID_FAIL:
            return getTagByIdFail(state, action.error.response);
        case actionTypes.RESET_GET_TAG_BY_ID:
            return resetGetTagById(state);
        case actionTypes.UPDATE_TAG_START:
            return updateTagStart(state);
        case actionTypes.UPDATE_TAG_SUCCESS:
            return updateTagSuccess(state, action.data);
        case actionTypes.UPDATE_TAG_FAIL:
            return updateTagFail(state, action.error.response);
        case actionTypes.RESET_UPDATE_TAG:
            return resetUpdateTag(state);
        case actionTypes.REMOVE_TAG_START:
            return removeTagStart(state);
        case actionTypes.REMOVE_TAG_SUCCESS:
            return removeTagSuccess(state, action.data);
        case actionTypes.REMOVE_TAG_FAIL:
            return removeTagFail(state, action.error.response);
        case actionTypes.RESET_REMOVE_TAG:
            return resetRemoveTag(state);
        default:
            return { ...state };
    }
};

export default reducer;
