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
