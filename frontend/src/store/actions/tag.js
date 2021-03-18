import * as actionTypes from './actionTypes';
import axios from '../../axios';

const getAllTagsStart = () => ({
    type: actionTypes.GET_ALL_TAGS_START,
});

const getAllTagsSucces = (data) => ({
    type: actionTypes.GET_ALL_TAGS_SUCCESS,
    data,
});

const getAllTagsFail = (error) => ({
    type: actionTypes.GET_ALL_TAGS_FAIL,
    error,
});

export const resetGetAllTags = () => ({ type: actionTypes.RESET_GET_ALL_TAGS });

export const getAllTags = (query) => (dispatch) => {
    dispatch(getAllTagsStart());
    axios
        .get(`/tags`, { params: query })
        .then((response) => dispatch(getAllTagsSucces(response.data)))
        .catch((error) => dispatch(getAllTagsFail(error)));
};

const createTagStart = () => ({
    type: actionTypes.CREATE_TAG_START,
});

const createTagSucces = (data) => ({
    type: actionTypes.CREATE_TAG_SUCCESS,
    data,
});

const createTagFail = (error) => ({
    type: actionTypes.CREATE_TAG_FAIL,
    error,
});

export const resetCreateTag = () => ({ type: actionTypes.RESET_CREATE_TAG });

export const createTag = (body) => (dispatch) => {
    dispatch(createTagStart());
    axios
        .post('/tags', body)
        .then((response) => dispatch(createTagSucces(response.data)))
        .catch((error) => dispatch(createTagFail(error)));
};

const getTagByIdStart = () => ({
    type: actionTypes.GET_TAG_BY_ID_START,
});

const getTagByIdSucces = (data) => ({
    type: actionTypes.GET_TAG_BY_ID_SUCCESS,
    data,
});

const getTagByIdFail = (error) => ({
    type: actionTypes.GET_TAG_BY_ID_FAIL,
    error,
});

export const resetGetTagById = () => ({ type: actionTypes.RESET_GET_TAG_BY_ID });

export const getTagById = (id) => (dispatch) => {
    dispatch(getTagByIdStart());
    axios
        .get(`/tags/${id}`)
        .then((response) => dispatch(getTagByIdSucces(response.data)))
        .catch((error) => dispatch(getTagByIdFail(error)));
};

const updateTagStart = () => ({
    type: actionTypes.UPDATE_TAG_START,
});

const updateTagSucces = () => ({
    type: actionTypes.UPDATE_TAG_SUCCESS,
});

const updateTagFail = (error) => ({
    type: actionTypes.UPDATE_TAG_FAIL,
    error,
});

export const resetUpdateTag = () => ({ type: actionTypes.RESET_UPDATE_TAG });

export const updateTag = ({ id, ...body }) => (dispatch) => {
    dispatch(updateTagStart());
    axios
        .put(`/tags/${id}`, body)
        .then(() => dispatch(updateTagSucces()))
        .catch((error) => dispatch(updateTagFail(error)));
};

const removeTagStart = () => ({
    type: actionTypes.REMOVE_TAG_START,
});

const removeTagSucces = () => ({
    type: actionTypes.REMOVE_TAG_SUCCESS,
});

const removeTagFail = (error) => ({
    type: actionTypes.REMOVE_TAG_FAIL,
    error,
});

export const resetRemoveTag = () => ({ type: actionTypes.RESET_REMOVE_TAG });

export const removeTag = (id, token) => (dispatch) => {
    dispatch(removeTagStart());
    axios
        .delete(`/tags/${id}`, { headers: { Authorization: token } })
        .then(() => dispatch(removeTagSucces()))
        .catch((error) => dispatch(removeTagFail(error)));
};
