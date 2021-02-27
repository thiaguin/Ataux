import { errors as errorTypes } from '../resources/errors';
import { entities as entitiesTypes } from '../resources/entities';

const getNouFoundMessageError = (entity) => `${entitiesTypes[entity]} ${errorTypes.NOT_FOUND.label}`;

const getInvalidPasswordMessageError = () => errorTypes.INVALID_PASSWORD.label;

const getInternalServerError = () => errorTypes.INTERNAL_SERVER.label;

export const getErrorMessage = (response) => {
    if (response.statusCode === 500) return getInternalServerError();
    const { type, entity } = response.data;

    switch (type) {
        case errorTypes.NOT_FOUND.value:
            return getNouFoundMessageError(entity.toUpperCase());
        case errorTypes.INVALID_PASSWORD.value:
            return getInvalidPasswordMessageError();
        default:
            return getInternalServerError();
    }
};
