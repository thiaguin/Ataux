import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Menu from '../menu/Menu';

const header = (props) => {
    const { isAuth, loggedUser } = props;

    const history = useHistory();

    const loginOnClickHandler = () => {
        props.onResetLogin();
        history.push('/login');
    };

    const registerOnClickHandler = () => {
        props.onResetRegister();
        history.push('/register');
    };

    const onLogout = () => {
        props.onLogout();
        history.push('/login');
    };

    const loggedHeader = (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">ATAUX</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="question">Questões</Nav.Link>
                <Nav.Link href="class">Turmas</Nav.Link>
                {loggedUser.role !== 'MEMBER' && <Nav.Link href="user">Usuários</Nav.Link>}
                <Nav.Link href="submission">Submissões</Nav.Link>
                {loggedUser.role !== 'MEMBER' && <Nav.Link href="tag">Tags</Nav.Link>}
            </Nav>
            <Nav className="mr-auto" />
            <Menu loggedUser={props.loggedUser} onLogoutClick={onLogout} />
        </Navbar>
    );

    const notLoggedHeader = (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">ATAUX</Navbar.Brand>
            <Nav className="mr-auto" />
            <div>
                <Button style={{ width: '100px' }} variant="secondary" onClick={loginOnClickHandler}>
                    Login
                </Button>
                {'  '}
                <Button style={{ width: '100px' }} variant="outline-info" onClick={registerOnClickHandler}>
                    Register
                </Button>
            </div>
        </Navbar>
    );

    return <>{isAuth ? loggedHeader : notLoggedHeader}</>;
};

const mapStateToProps = (state) => ({
    isAuth: !!state.login.token,
    loggedUser: state.login.user,
});

const mapDispatchToProps = (dispatch) => ({
    onLogout: () => dispatch(actions.logout()),
    onResetRegister: () => dispatch(actions.resetRegister()),
    onResetLogin: () => dispatch(actions.resetLogin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(header);
