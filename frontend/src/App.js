import React, { useCallback, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header/Header';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import RecoverPassword from './pages/recoverPasword/RecoverPassword';
import UpdateRecoveredPassword from './pages/updateRecoveredPassword/UpdateRecoveredPassword';
import * as actions from './store/actions';
import ConfirmEmail from './pages/confirmEmail/ConfirmEmail';

const App = (props) => {
    const dispatch = useDispatch();
    const onAuthCheck = useCallback(() => dispatch(actions.authCheck()), [dispatch]);

    const { login } = props;
    const isAuth = login.token;
    const missInfo = login.role === 'MEMBER' && (!login.handle || !login.registration);

    const missInfoRoutes = (
        <Switch>
            <Route path="/confirmInfo" />
            <Redirect to="/confirmInfo" />
        </Switch>
    );

    const freeRoutes = (
        <Switch>
            <Route path="/login" component={(currProps) => <Login {...currProps} />} />
            <Route path="/register" render={(currProps) => <Register {...currProps} />} />
            <Route path="/confirm/:code" render={(currProps) => <ConfirmEmail {...currProps} />} />
            <Route path="/recoverPassword/:code" render={(currProps) => <UpdateRecoveredPassword {...currProps} />} />
            <Route path="/recoverPassword" render={(currProps) => <RecoverPassword {...currProps} />} />
            <Redirect to="/" />
        </Switch>
    );

    const loggedRoutesOk = (
        <Switch>
            <Route path="/" />
        </Switch>
    );

    const loggedRoutes = missInfo ? missInfoRoutes : loggedRoutesOk;

    useEffect(() => {
        onAuthCheck();
    }, [onAuthCheck]);

    return (
        <>
            <Header />
            {isAuth ? loggedRoutes : freeRoutes}
        </>
    );
};

const mapStateToProps = (state) => ({
    login: state.login,
});

export default withRouter(connect(mapStateToProps)(App));
