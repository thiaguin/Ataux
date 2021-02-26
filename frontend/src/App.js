import React, { useCallback, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header/Header';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ResetPassword from './pages/resetPassword/ResetPassword';
import * as actions from './store/actions';

const App = (props) => {
    const dispatch = useDispatch();
    const onAuthCheck = useCallback(() => dispatch(actions.authCheck()), [dispatch]);

    const { isAuth } = props;

    useEffect(() => {
        onAuthCheck();
    }, [onAuthCheck]);

    const freeRoutes = (
        <Switch>
            <Route path="/login" component={(currProps) => <Login {...currProps} />} />
            <Route path="/register" render={(currProps) => <Register {...currProps} />} />
            <Route path="/resetPassword" render={(currProps) => <ResetPassword {...currProps} />} />
            <Redirect to="/" />
        </Switch>
    );

    const loggedRoutes = (
        <Switch>
            <Route path="/" />
        </Switch>
    );

    return (
        <>
            <Header />
            {isAuth ? loggedRoutes : freeRoutes}
        </>
    );
};

const mapStateToProps = (state) => ({
    isAuth: !!state.login.token,
});

export default withRouter(connect(mapStateToProps)(App));
