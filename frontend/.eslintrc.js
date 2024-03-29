module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['airbnb', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        __DEV__: 'readonly',
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
        'react/jsx-props-no-spreading': 0,
        'react/destructuring-assignment': 0,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'react/prop-types': 0,
        'no-console': ['error', { allow: ['tron'] }],
    },
};
