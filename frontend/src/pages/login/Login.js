import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import GoogleButton from '../../components/utils/GoogleButton';
import Popup from '../../components/utils/Popup';

const Login = (props) => {
    const { login } = props;
    const [popup, setPopup] = useState(null);
    const [recoverPasswordHover, setrecoverPasswordHover] = useState(false);
    const [recoverPasswordStyle, setrecoverPasswordStyle] = useState({ textAlign: 'center' });
    const history = useHistory();
    const loginError = login.error;

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
    });

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

    const recoverPasswordHoverHandler = () => {
        setrecoverPasswordHover(!recoverPasswordHover);
    };

    const loginGoogleHandler = (response) => {
        // eslint-disable-next-line no-console
        console.log('response', response);
    };

    const loginHandler = (value) => {
        props.onClickLogin(value);
    };

    const recoverPasswordClickHandler = () => {
        props.onResetRecoverPassword();
        history.push('recoverPassword');
    };

    useEffect(() => {
        if (loginError) {
            setPopup(<Popup type="error" message={loginError} />);
            props.onResetLogin();
        }
    }, [loginError]);

    useEffect(() => {
        if (recoverPasswordHover) {
            setrecoverPasswordStyle({ ...recoverPasswordStyle, textDecoration: 'underline', cursor: 'pointer' });
        } else {
            setrecoverPasswordStyle({ textAlign: 'center' });
        }
    }, [recoverPasswordHover]);

    return (
        <>
            {popup}
            <Formik validationSchema={schema} initialValues={{ email: '', password: '' }}>
                {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                    <div style={parentInStyle}>
                        <div style={childInStyle}>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail" onSubmit={loginHandler}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        name="email"
                                        value={values.email}
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={handleChange}
                                        isInvalid={touched.email && errors.email}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">Not valid email!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" onSubmit={loginHandler}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        name="password"
                                        value={values.password}
                                        type="password"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                                <Form.Text
                                    onClick={recoverPasswordClickHandler}
                                    onMouseEnter={recoverPasswordHoverHandler}
                                    onMouseLeave={recoverPasswordHoverHandler}
                                    style={recoverPasswordStyle}
                                    className="text-muted"
                                >
                                    Esqueceu sua senha?
                                </Form.Text>
                                <Form.Row style={{ paddingTop: '20px' }}>
                                    <Form.Group as={Col} controlId="formGridGoogleButton">
                                        <GoogleLogin
                                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                            render={(renderProps) => (
                                                <GoogleButton
                                                    onClick={renderProps.onClick}
                                                    style={{ minWidth: '200px' }}
                                                />
                                            )}
                                            onSuccess={loginGoogleHandler}
                                            onFailure={loginGoogleHandler}
                                            cookiePolicy="single_host_origin"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridSubmtiButton">
                                        <Button
                                            style={{ width: '100%', minWidth: '200px' }}
                                            variant="primary"
                                            type="submit"
                                            disabled={touched.email && touched.password && !isValid}
                                            onClick={() => loginHandler(values)}
                                        >
                                            Login
                                        </Button>
                                    </Form.Group>
                                </Form.Row>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

const mapStateToProps = (state) => ({
    login: state.login,
});

const mapDispatchToProps = (dispatch) => ({
    onClickLogin: (value) => dispatch(actions.login(value)),
    onResetLogin: () => dispatch(actions.resetLogin()),
    onResetRecoverPassword: () => dispatch(actions.resetRecoverPassword()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
