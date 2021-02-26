import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';

const header = (props) => {
    const { isAuth } = props;

    const history = useHistory();

    const loginOnClickHandler = () => {
        history.push('login');
    };

    const registerOnClickHandler = () => {
        history.push('register');
    };

    const loggedHeader = (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand onClick={props.onLogout} href="home">
                AUTAX
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="questions">Questões</Nav.Link>
                <Nav.Link href="classes">Turmas</Nav.Link>
            </Nav>
            <Nav className="mr-auto" />
        </Navbar>
    );

    const notLoggedHeader = (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="home">AUTAX</Navbar.Brand>
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
});

const mapDispatchToProps = (dispatch) => ({
    onLogout: () => dispatch(actions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(header);
