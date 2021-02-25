import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from '../../components/utils/googleButton';

const login = () => {
    const parentInStyle = {
        margin: '10% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid silver',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '10% 10% 3% 10%',
    };

    const responseGoogle = (response) => {
        // eslint-disable-next-line no-console
        console.log('response', response);
    };

    return (
        <div style={parentInStyle}>
            <div style={childInStyle}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Row style={{ paddingTop: '20px' }}>
                        <Form.Group as={Col} controlId="formGridGoogleButton">
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                render={(renderProps) => <GoogleButton onClick={renderProps.onClick} />}
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy="single_host_origin"
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridSubmtiButton">
                            <Button style={{ width: '100%' }} variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        </div>
    );
};
export default login;
