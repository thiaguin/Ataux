import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Form, Button, Toast } from 'react-bootstrap';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import SpinnerButton from '../../components/spinnerButton/SpinnerButton';

const UpdatePasswordRecovered = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const onInitPage = useCallback((value) => dispatch(actions.existCodeToRecover(value)), [dispatch]);
    const [popup, setPopup] = useState(null);

    const schema = Yup.object().shape({
        password: Yup.string().min(6).required(),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });

    const { code } = props.match.params;
    const { loadingUpdate, updated } = props.updatePasswordRecovered;

    const parentInStyle = {
        margin: '10% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '8% 10% 3% 10%',
    };

    const submitHandler = (values) => {
        props.onUpdateRecoveredPassword({ code, password: values.password });
    };

    const goToLoginHandler = () => {
        history.push('/login');
    };

    useEffect(() => {
        if (code) {
            onInitPage(code);
        }
    }, [onInitPage, code]);

    useEffect(() => {
        if (props.updatePasswordRecovered.exist === false) {
            history.push('/');
        }
    }, [props.updatePasswordRecovered.exist]);

    useEffect(() => {
        if (props.updatePasswordRecovered.updateError) {
            setPopup(
                <Popup
                    type="error"
                    message={props.updatePasswordRecovered.updateError}
                    onClose={props.onResetUpdateRecoveredPassowrd}
                />,
            );
        }
    }, [props.updatePasswordRecovered.updateError]);

    return (
        <>
            {!updated ? (
                <Formik validationSchema={schema} initialValues={{ password: '', confirmPassword: '' }}>
                    {({ handleSubmit, handleBlur, values, touched, isValid, handleChange, errors }) => (
                        <div style={parentInStyle}>
                            <div style={childInStyle}>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Nova Senha</Form.Label>
                                        <Form.Control
                                            name="password"
                                            value={values.password}
                                            type="password"
                                            placeholder="New Password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.password && errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Senha de tamanho minímo de 6 caracteres!
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formConfirmPassword">
                                        <Form.Label>Confirmar Senha</Form.Label>
                                        <Form.Control
                                            name="confirmPassword"
                                            value={values.confirmPassword}
                                            type="password"
                                            placeholder="Confirm Password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                                touched.confirmPassword && values.password !== values.confirmPassword
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Senhas não conferem.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group style={{ textAlign: 'right' }} controlId="formGridSubmtiButton">
                                        {loadingUpdate ? (
                                            <SpinnerButton />
                                        ) : (
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                onClick={() => submitHandler(values)}
                                                disabled={values.confirmPassword !== values.password || !isValid}
                                            >
                                                Enviar
                                            </Button>
                                        )}
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>
                    )}
                </Formik>
            ) : (
                <>
                    <div style={{ ...parentInStyle }}>
                        <div style={{ margin: '10% 20%' }}>
                            <Toast>
                                <Toast.Header>
                                    <strong className="mr-auto">Senha Atualizada</strong>
                                </Toast.Header>
                                <Toast.Body>Agora você pode logar na sua conta com a nova senha cadastrada!</Toast.Body>
                            </Toast>
                            <div style={{ textAlign: 'right' }}>
                                <Button type="submit" onClick={() => goToLoginHandler()} variant="primary">
                                    Ir Para Login
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {popup}
        </>
    );
};

const mapStateToProps = (state) => ({
    updatePasswordRecovered: state.updateRecoveredPassword,
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateRecoveredPassword: (values) => dispatch(actions.updateRecoverPassword(values)),
    onResetUpdateRecoveredPassowrd: () => dispatch(actions.resetUpdateRecoverPassword()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordRecovered);
