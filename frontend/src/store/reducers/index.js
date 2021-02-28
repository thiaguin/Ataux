import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import loginReducer from './login';
import recoverPasswordReducer from './recoverPassword';
import updateRecoveredPasswordReducer from './updateRecoveredPassword';
import confirmEmailReducer from './confirmEmail';
import registerReducer from './register';
import userReducer from './user';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    login: loginReducer,
    recoverPassword: recoverPasswordReducer,
    updateRecoveredPassword: updateRecoveredPasswordReducer,
    confirmEmail: confirmEmailReducer,
    register: registerReducer,
    user: userReducer,
});

export const Store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
