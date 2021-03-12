import { errors as errorTypes } from '../resources/errors';
import { entities as entitiesTypes } from '../resources/entities';

const getNotFoundMessageError = (entity) => `${entitiesTypes[entity]} ${errorTypes.NOT_FOUND.label}`;

const getNotUniqueMessageError = (entity) => `${entitiesTypes[entity]} ${errorTypes.NOT_UNIQUE.label}`;

const getInvalidPasswordMessageError = () => errorTypes.INVALID_PASSWORD.label;

const getInternalServerError = () => errorTypes.INTERNAL_SERVER.label;

const getBadRequestMessageError = (entity) => entitiesTypes[entity];

const getUnauthorizedMessageError = (entity) => entitiesTypes[entity];

const getGoogleUserMessageError = () => errorTypes.GOOGLE_USER.label;

const getToManyRequestMessageError = () => errorTypes.TO_MANY_REQUEST.label;

export const getErrorMessage = (response) => {
    if (!response || !response.data) return getInternalServerError();

    const { type, entity } = response.data;

    if (response.status === 500 || !type || !entity) {
        return getInternalServerError();
    }

    const entityWords = entity.match(/[A-Z][^A-Z]*/g);
    const entityType = entityWords.map((word) => word.toUpperCase()).join('_');

    switch (type) {
        case errorTypes.BAD_REQUEST.value:
            return getBadRequestMessageError(entityType);
        case errorTypes.NOT_UNIQUE.value:
            return getNotUniqueMessageError(entityType);
        case errorTypes.NOT_FOUND.value:
            return getNotFoundMessageError(entityType);
        case errorTypes.UNAUTHORIZED.value:
            return getUnauthorizedMessageError(entityType);
        case errorTypes.INVALID_PASSWORD.value:
            return getInvalidPasswordMessageError();
        case errorTypes.GOOGLE_USER.value:
            return getGoogleUserMessageError();
        case errorTypes.TO_MANY_REQUEST.value:
            return getToManyRequestMessageError();
        default:
            return getInternalServerError();
    }
};
