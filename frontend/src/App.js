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
import ConfirmInfoPage from './pages/confirmMemberInfo/ConfirmMemberInfo';
import Question from './pages/question/Question';
import QuestionList from './pages/question/QuestionList';
import Tag from './pages/tag/Tag';
import TagList from './pages/tag/TagList';
import ClassList from './pages/class/ClassList';

const App = (props) => {
    const dispatch = useDispatch();
    const onAuthCheck = useCallback(() => dispatch(actions.authCheck()), [dispatch]);

    const { login } = props;
    const isAuth = login.token;
    const missInfo = login.role === 'MEMBER' && (!login.handle || !login.registration);

    const missInfoRoutes = (
        <Switch>
            <Route path="/confirmInfo" render={(currProps) => <ConfirmInfoPage {...currProps} />} />
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
            <Route path="/" render={() => <div>Main Page Logged</div>} />
            <Redirect to="/" />
        </Switch>
    );

    const loggedRoutesOk = (
        <Switch>
            <Route path="/question/:mode/:questionId?" render={(currProps) => <Question {...currProps} />} />
            <Route path="/question" render={(currProps) => <QuestionList {...currProps} />} />
            <Route path="/tag/:mode/:tagId?" render={(currProps) => <Tag {...currProps} />} />
            <Route path="/tag" render={(currProps) => <TagList {...currProps} />} />
            <Route path="/class" render={(currProps) => <ClassList {...currProps} />} />
            <Route path="/" render={() => <div>Main Page Logged</div>} />
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
