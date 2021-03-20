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
import Class from './pages/class/Class';
import List from './pages/list/List';
import ListQuestion from './pages/listQuestion/ListQuestion';
import SubmissionList from './pages/submission/SubmissionList';
import Submission from './pages/submission/Submission';
import UserList from './pages/user/UserList';
import User from './pages/user/User';
import ClassAddUser from './pages/class/ClassAddUser';
import MainPage from './pages/mainPage/MainPage';

const App = (props) => {
    const dispatch = useDispatch();
    const onAuthCheck = useCallback(() => dispatch(actions.authCheck()), [dispatch]);

    const { login } = props;
    const isAuth = login.token;
    const missInfo = login.user.role === 'MEMBER' && (!login.user.handle || !login.user.registration);

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
            <Route>
                <MainPage />
            </Route>
        </Switch>
    );

    const memberRoutes = (
        <Switch>
            <Route path="/login" component={(currProps) => <Login {...currProps} />} />
            <Route exact path="/question/:mode/:questionId?" render={(currProps) => <Question {...currProps} />} />
            <Route exact path="/question" render={(currProps) => <QuestionList {...currProps} />} />
            <Route
                exact
                path="/list/:listId/question/show/:questionId?"
                render={(currProps) => <ListQuestion {...currProps} />}
            />
            <Route exact path="/list/:mode/:listId?" render={(currProps) => <List {...currProps} />} />
            <Route exact path="/class/:mode/:classId/:relation" render={(currProps) => <Class {...currProps} />} />
            <Route exact path="/class/:mode/:classId?" render={(currProps) => <Class {...currProps} />} />
            <Route exact path="/class" render={(currProps) => <ClassList {...currProps} />} />
            <Route exact path="/submission/show/:submissionId" render={(currProps) => <Submission {...currProps} />} />
            <Route exact path="/submission" render={(currProps) => <SubmissionList {...currProps} />} />
            <Route exact path="/user/:mode/:userId?" render={(currProps) => <User {...currProps} />} />
            <Route>
                <MainPage />
            </Route>
        </Switch>
    );

    const loggedRoutesOk = (
        <Switch>
            <Route path="/login" component={(currProps) => <Login {...currProps} />} />
            <Route exact path="/question/:mode/:questionId?" render={(currProps) => <Question {...currProps} />} />
            <Route exact path="/question" render={(currProps) => <QuestionList {...currProps} />} />
            <Route exact path="/tag/:mode/:tagId?" render={(currProps) => <Tag {...currProps} />} />
            <Route exact path="/tag" render={(currProps) => <TagList {...currProps} />} />
            <Route
                exact
                path="/list/:listId/question/show/:questionId?"
                render={(currProps) => <ListQuestion {...currProps} />}
            />
            <Route exact path="/list/:mode/:listId?" render={(currProps) => <List {...currProps} />} />
            <Route exact path="/class/:classId/list/:mode" render={(currProps) => <List {...currProps} />} />
            <Route exact path="/class/:classId?/user/add" render={(currProps) => <ClassAddUser {...currProps} />} />
            <Route exact path="/class/:mode/:classId/:relation" render={(currProps) => <Class {...currProps} />} />
            <Route exact path="/class/:mode/:classId?" render={(currProps) => <Class {...currProps} />} />
            <Route exact path="/class" render={(currProps) => <ClassList {...currProps} />} />
            <Route exact path="/submission/show/:submissionId" render={(currProps) => <Submission {...currProps} />} />
            <Route exact path="/submission" render={(currProps) => <SubmissionList {...currProps} />} />
            <Route exact path="/user/:mode/:userId?" render={(currProps) => <User {...currProps} />} />
            <Route exact path="/user" render={(currProps) => <UserList {...currProps} />} />
            <Route>
                <MainPage />
            </Route>
        </Switch>
    );

    const loggedRouteByRole = login.user.role === 'MEMBER' ? memberRoutes : loggedRoutesOk;
    const loggedRoutes = missInfo ? missInfoRoutes : loggedRouteByRole;

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
