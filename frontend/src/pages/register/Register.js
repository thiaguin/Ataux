import React, { useEffect, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import GoogleButton from '../../components/googleButton/GoogleButton';
import * as actions from '../../store/actions';
import SpinnerButton from '../../components/spinnerButton/SpinnerButton';
import Modal from '../../components/modal/Modal';
import Popup from '../../components/popup/Popup';

const Register = (props) => {
    const [modal, setModal] = useState(null);
    const [popup, setPopup] = useState(null);
    const history = useHistory();

    const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        name: Yup.string().required(),
        password: Yup.string().min(6).required(),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required(),
    });

    const parentInStyle = {
        margin: '5% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid silver',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '10% 10% 3% 10%',
    };

    const registerHandler = (values) => {
        props.onRegister(values);
    };

    const registerGoogleHandler = (response) => {
        props.onGoogleRegister({ token: response.tokenId });
    };

    const closeModalHandler = () => {
        setModal(null);
        history.push('/login');
    };

    const resendEmailHandler = () => {};

    useEffect(() => {
        if (props.register.success) {
            const body =
                'Você receberá um email com um link para confirmação.\n Caso não receba poderemos enviar outro email.';
            setModal(
                <Modal
                    title="Usuário cadastro"
                    body={body}
                    secondaryButton="Reenviar email."
                    primaryButton="OK"
                    primaryButtonOnClick={closeModalHandler}
                    secondaryButtonOnClick={resendEmailHandler}
                />,
            );
        } else {
            setModal(null);
        }
    }, [props.register.success]);

    useEffect(() => {
        if (props.register.error) {
            setPopup(<Popup type="error" message={props.register.error} />);
            props.onResetRegister();
        }
    }, [props.register.error]);

    return (
        <>
            {popup}
            {modal || (
                <Formik
                    validationSchema={schema}
                    initialValues={{ email: '', password: '', name: '', confirmPassword: '' }}
                >
                    {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                        <div style={parentInStyle}>
                            <div style={childInStyle}>
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group controlId="formName" onSubmit={registerHandler}>
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            required
                                            name="name"
                                            value={values.name}
                                            type="name"
                                            placeholder="Nome"
                                            onChange={handleChange}
                                            isInvalid={touched.name && errors.name}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">Campo Obrigatório</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formEmail" onSubmit={registerHandler}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            required
                                            name="email"
                                            value={values.email}
                                            type="email"
                                            placeholder="Email"
                                            onChange={handleChange}
                                            isInvalid={touched.email && errors.email}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {values.email ? 'Not valid email!' : 'Campo Obrigatório'}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formPassword" onSubmit={registerHandler}>
                                        <Form.Label>Senha</Form.Label>
                                        <Form.Control
                                            required
                                            name="password"
                                            value={values.password}
                                            type="password"
                                            placeholder="Senha"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.password && errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {values.password
                                                ? 'Senha de tamanho minímo de 6 caracteres!'
                                                : 'Campo Obrigatório'}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formConfirmPassword">
                                        <Form.Label>Confirmar Senha</Form.Label>
                                        <Form.Control
                                            required
                                            name="confirmPassword"
                                            value={values.confirmPassword}
                                            type="password"
                                            placeholder="Confirmar Senha"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.confirmPassword && errors.confirmPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {values.password ? 'Senhas não conferem.' : 'Campo Obrigatório'}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Row style={{ paddingTop: '40px' }}>
                                        <Form.Group as={Col} controlId="formGridGoogleButton">
                                            <GoogleLogin
                                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                                render={(renderProps) => (
                                                    <GoogleButton
                                                        name="Cadastrar com Google"
                                                        onClick={renderProps.onClick}
                                                        style={{ minWidth: '200px' }}
                                                    />
                                                )}
                                                onSuccess={registerGoogleHandler}
                                                cookiePolicy="single_host_origin"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridSubmtiButton">
                                            {props.register.loading ? (
                                                <SpinnerButton style={{ width: '100%', minWidth: '200px' }} />
                                            ) : (
                                                <Button
                                                    style={{ width: '100%', minWidth: '200px' }}
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={
                                                        !values.email ||
                                                        !values.password ||
                                                        !values.name ||
                                                        !values.confirmPassword ||
                                                        !isValid
                                                    }
                                                    onClick={() => registerHandler(values)}
                                                >
                                                    Cadastrar
                                                </Button>
                                            )}
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
    register: state.register,
});

const mapDispatchToProps = (dispatch) => ({
    onGoogleRegister: (value) => dispatch(actions.googleLogin(value)),
    onRegister: (value) => dispatch(actions.register(value)),
    onResetRegister: () => dispatch(actions.resetRegister()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
