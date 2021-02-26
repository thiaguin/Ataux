import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

function App() {
    const routes = (
        <Switch>
            <Route path="/login" component={(props) => <Login {...props} />} />
            <Route path="/register" render={(props) => <Register {...props} />} />
            <Route path="/" />
        </Switch>
    );
    return (
        <>
            <Header />
            {routes}
        </>
    );
}

export default withRouter(App);
