import * as actionTypes from './actionTypes';
import axios from '../../axios';

const getAllClassesStart = () => ({
    type: actionTypes.GET_ALL_CLASSES_START,
});

const getAllClassesSucces = (data) => ({
    type: actionTypes.GET_ALL_CLASSES_SUCCESS,
    data,
});

const getAllClassesFail = (error) => ({
    type: actionTypes.GET_ALL_CLASSES_FAIL,
    error,
});

export const resetGetAllClasses = () => ({ type: actionTypes.RESET_GET_ALL_CLASSES });

export const getAllClasses = (query) => (dispatch) => {
    dispatch(getAllClassesStart());
    axios
        .get(`/classes`, { params: query })
        .then((response) => dispatch(getAllClassesSucces(response.data)))
        .catch((error) => dispatch(getAllClassesFail(error)));
};
