import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import GoogleButton from '../../components/googleButton/GoogleButton';
import Popup from '../../components/popup/Popup';
import Modal from '../../components/modal/Modal';
import { entities as entitiesTypes } from '../../resources/entities';

const Login = (props) => {
    const { login, confirmEmail } = props;
    const [popup, setPopup] = useState(null);
    const [modal, setModal] = useState(null);
    const [email, setEmail] = useState('');
    const [recoverPasswordHover, setrecoverPasswordHover] = useState(false);
    const [recoverPasswordStyle, setrecoverPasswordStyle] = useState({ textAlign: 'center' });
    const history = useHistory();
    const loginError = login.error;

    const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
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
        props.onGoogleLogin({ token: response.tokenId });
    };

    const loginHandler = (value) => {
        props.onClickLogin(value);
    };

    const recoverPasswordClickHandler = () => {
        props.onResetRecoverPassword();
        history.push('recoverPassword');
    };

    const resendEmailHandler = () => {
        props.onResendEmailToConfirm({ email });
    };

    const closeModalHandler = () => {
        setModal(null);
    };

    const emailChangeHandler = (event, handleChange) => {
        setEmail(event.target.value);
        handleChange(event);
    };

    useEffect(() => {
        if (loginError) {
            if (loginError !== entitiesTypes.NOT_CONFIRMED) {
                setPopup(<Popup type="error" message={loginError} />);
                props.onResetLogin();
            } else {
                const body =
                    'Você ainda não confirmou seu email.\n caso seja necessário renviaremos outro email para confirmação de cadastro.';
                setModal(
                    <Modal
                        title="Usuário não confirmado"
                        body={body}
                        secondaryButton="Reenviar email."
                        primaryButton="OK"
                        primaryButtonOnClick={closeModalHandler}
                        secondaryButtonOnClick={resendEmailHandler}
                    />,
                );
            }
        } else {
            setModal(null);
        }
    }, [loginError]);

    useEffect(() => {
        if (recoverPasswordHover) {
            setrecoverPasswordStyle({ ...recoverPasswordStyle, textDecoration: 'underline', cursor: 'pointer' });
        } else {
            setrecoverPasswordStyle({ textAlign: 'center' });
        }
    }, [recoverPasswordHover]);

    useEffect(() => {
        if (confirmEmail.resended) {
            setModal(null);
            setPopup(<Popup type="info" message="Você receberá um novo email para confirmar o seu cadastro." />);
            props.onResetResendEmailToConfirm();
        }
    }, [confirmEmail.resended]);

    return (
        <>
            {popup}
            {modal}
            {!modal && (
                <Formik validationSchema={schema} initialValues={{ email: '', password: '' }}>
                    {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                        <div style={parentInStyle}>
                            <div style={childInStyle}>
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group controlId="formEmail" onSubmit={loginHandler}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="email"
                                            value={values.email}
                                            type="email"
                                            placeholder="Enter email"
                                            onChange={(event) => emailChangeHandler(event, handleChange)}
                                            isInvalid={touched.email && errors.email}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">Not valid email!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formPassword" onSubmit={loginHandler}>
                                        <Form.Label>Senha</Form.Label>
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
                                                        name="Entrar com Google"
                                                        onClick={renderProps.onClick}
                                                        style={{ minWidth: '200px' }}
                                                    />
                                                )}
                                                onSuccess={loginGoogleHandler}
                                                cookiePolicy="single_host_origin"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridSubmtiButton">
                                            <Button
                                                style={{ width: '100%', minWidth: '200px' }}
                                                variant="primary"
                                                type="submit"
                                                disabled={!values.email || !values.password || !isValid}
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
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    login: state.login,
    confirmEmail: state.confirmEmail,
});

const mapDispatchToProps = (dispatch) => ({
    onGoogleLogin: (value) => dispatch(actions.googleLogin(value)),
    onClickLogin: (value) => dispatch(actions.login(value)),
    onResetLogin: () => dispatch(actions.resetLogin()),
    onResetRecoverPassword: () => dispatch(actions.resetRecoverPassword()),
    onResendEmailToConfirm: (values) => dispatch(actions.resendEmail(values)),
    onResetResendEmailToConfirm: () => dispatch(actions.resetResendEmail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
