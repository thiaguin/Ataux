import { errors as errorTypes } from '../resources/errors';
import { entities as entitiesTypes } from '../resources/entities';

const getNouFoundMessageError = (entity) => `${entitiesTypes[entity]} ${errorTypes.NOT_FOUND.label}`;

const getInvalidPasswordMessageError = () => errorTypes.INVALID_PASSWORD.label;

const getInternalServerError = () => errorTypes.INTERNAL_SERVER.label;

const getBadRequestMessageError = (entity) => entitiesTypes[entity];

const getUnauthorizedMessageError = (entity) => entitiesTypes[entity];

const getGoogleUserMessageError = () => errorTypes.GOOGLE_USER.label;

export const getErrorMessage = (response) => {
    if (response.status === 500) return getInternalServerError();

    const { type } = response.data;
    const entityWords = response.data.entity.match(/[A-Z][^A-Z]*/g);
    const entity = entityWords.map((word) => word.toUpperCase()).join('_');
    // eslint-disable-next-line no-console
    console.log(type, errorTypes.GOOGLE_USER.value);
    switch (type) {
        case errorTypes.BAD_REQUEST.value:
            return getBadRequestMessageError(entity);
        case errorTypes.NOT_FOUND.value:
            return getNouFoundMessageError(entity);
        case errorTypes.INVALID_PASSWORD.value:
            return getInvalidPasswordMessageError();
        case errorTypes.UNAUTHORIZED.value:
            return getUnauthorizedMessageError(entity);
        case errorTypes.GOOGLE_USER.value:
            // eslint-disable-next-line no-console
            console.log('NTROU');

            return getGoogleUserMessageError(entity);
        default:
            return getInternalServerError();
    }
};
