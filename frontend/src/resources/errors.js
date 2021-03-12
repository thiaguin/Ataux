export const errors = {
    NOT_FOUND: { value: 'NOT_FOUND', label: 'não encontrado(a).' },
    NOT_UNIQUE: { value: 'NOT_UNIQUE', label: 'já cadastrado(a).' },
    BAD_REQUEST: { value: 'BAD_REQUEST', label: 'bad request' },
    INVALID_PASSWORD: { value: 'INVALID_PASSWORD', label: 'Senha Incorreta.' },
    INTERNAL_SERVER: { value: 'INTERNAL_SERVER', label: 'Ocorreu um erro inesperado.' },
    UNAUTHORIZED: { value: 'UNAUTHORIZED', label: 'Você não tem autorização para isso.' },
    GOOGLE_USER: { value: 'GOOGLE_USER', label: 'Usuário cadastrado pelo google.' },
    TO_MANY_REQUEST: {
        value: 'TO_MANY_REQUEST',
        label: 'Seriço temporariamente indisponível. Tente novamente em instantes.',
    },
};
