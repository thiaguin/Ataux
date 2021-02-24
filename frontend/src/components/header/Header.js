import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const header = () => {
    const history = useHistory();

    const loginOnClickHandler = () => {
        history.push('login');
    };

    const registerOnClickHandler = () => {
        history.push('register');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="home">AUTAX</Navbar.Brand>
                <Nav className="mr-auto" />
                <div>
                    <Button variant="secondary" onClick={loginOnClickHandler}>
                        Login
                    </Button>
                    {'  '}
                    <Button variant="outline-info" onClick={registerOnClickHandler}>
                        Register
                    </Button>
                </div>
            </Navbar>
        </>
    );
};

export default header;
