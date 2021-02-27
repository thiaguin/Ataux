import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Form, Button, Spinner, Toast } from 'react-bootstrap';
import * as actions from '../../store/actions';
import Popup from '../../components/utils/Popup';

const UpdatePasswordRecovered = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const onInitPage = useCallback((value) => dispatch(actions.existCodeToRecover(value)), [dispatch]);
    const [popup, setPopup] = useState(null);

    const schema = yup.object().shape({
        password: yup.string().min(6).required(),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    const { code } = props.match.params;
    const { loadingUpdate, updated } = props.updatePasswordRecovered;

    const parentInStyle = {
        margin: '10% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid silver',
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

    const SubmitButton = (currProps) => (
        <>
            <Button
                type="submit"
                variant="primary"
                onClick={() => submitHandler(currProps.values)}
                disabled={currProps.values.confirmPassword !== currProps.values.password || !currProps.isValid}
            >
                Enviar
            </Button>
        </>
    );

    const SpinnerSubmittButton = () => (
        <>
            <Button variant="primary" disabled>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="sr-only">Loading...</span>
            </Button>
        </>
    );

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
            setPopup(<Popup type="error" message={props.updatePasswordRecovered.updateError} />);
            props.onResetUpdateRecoveredPassowrd();
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
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>New Password</Form.Label>
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
                                    <Form.Group controlId="formBasicConfirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
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
                                            <SpinnerSubmittButton />
                                        ) : (
                                            <SubmitButton values={values} isValid={isValid} />
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
