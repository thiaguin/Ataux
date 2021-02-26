import { errors as errorTypes } from '../resources/errors';
import { entities as entitiesTypes } from '../resources/entities';

const getNouFoundMessageError = (entity) => `${entitiesTypes[entity]} ${errorTypes.NOT_FOUND.label}`;

const getInvalidPasswordMessageError = () => errorTypes.INVALID_PASSWORD.label;

export const getErrorMessage = (entity, type) => {
    switch (type) {
        case errorTypes.NOT_FOUND.value:
            return getNouFoundMessageError(entity);
        case errorTypes.INVALID_PASSWORD.value:
            return getInvalidPasswordMessageError();
        default:
            return 'Aconteceu um erro inesperado.';
    }
};
