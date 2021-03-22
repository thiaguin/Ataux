import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../../store/actions';
import SpinnerButton from '../../components/spinnerButton/SpinnerButton';
import Popup from '../../components/popup/Popup';

const ConfirmInfoPage = (props) => {
    const { login } = props;

    const [popup, setPopup] = useState(null);

    const loginHandle = login && login.handle ? login.handle : '';
    const loginRegistration = login && login.registration ? login.registration : '';

    const schema = Yup.object().shape({
        handle: Yup.string().required(),
        registration: Yup.string().required(),
    });

    const parentInStyle = {
        margin: '10% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '8% 10% 8% 10%',
    };

    const submitHandler = (values) => {
        props.onCheckValidMissInfo({ ...values, userId: login.user.userId }, login.token);
    };

    useEffect(() => {
        if (props.user.error) {
            setPopup(<Popup type="error" message={props.user.error} onClose={props.onResetUpdateUser} />);
        }
    }, [props.user.error]);

    useEffect(() => {
        if (props.user.success) {
            props.onRefreshToken({ token: login.token });
            props.onResetUpdateUser();
        }
    }, [props.user.success]);

    return (
        <>
            {popup}
            <Formik validationSchema={schema} initialValues={{ handle: loginHandle, registration: loginRegistration }}>
                {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                    <div style={parentInStyle}>
                        <div style={childInStyle}>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Text style={{ margin: '10px' }} className="text-muted">
                                    Para continuar como aluno preencha as seguintes informações.
                                </Form.Text>
                                <Form.Group controlId="formHandle" onSubmit={submitHandler}>
                                    <Form.Label>Codeforces Handle</Form.Label>
                                    <Form.Control
                                        disabled={!!loginHandle}
                                        name="handle"
                                        value={loginHandle || values.handle}
                                        type="text"
                                        placeholder="Handle do codeforces"
                                        onChange={handleChange}
                                        isInvalid={touched.handle && errors.handle}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formRegistration" onSubmit={submitHandler}>
                                    <Form.Label>Matrícula da UFCG</Form.Label>
                                    <Form.Control
                                        disabled={!!loginRegistration}
                                        name="registration"
                                        value={loginRegistration || values.registration}
                                        type="registration"
                                        placeholder="Matrícula da UFCG"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                                <Form.Group
                                    style={{ textAlign: 'right', marginTop: '10px' }}
                                    controlId="formGridSubmtiButton"
                                >
                                    {props.user.loading ? (
                                        <SpinnerButton style={{ width: '100px' }} />
                                    ) : (
                                        <Button
                                            style={{ width: '100px' }}
                                            variant="primary"
                                            type="submit"
                                            disabled={!values.handle || !values.registration || !isValid}
                                            onClick={() => submitHandler(values)}
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
        </>
    );
};

const mapStateToProps = (state) => ({
    login: state.login,
    user: state.user.update,
});

const mapDispatchToProps = (dispatch) => ({
    onCheckValidMissInfo: (...values) => dispatch(actions.checkValidMissInfo(...values)),
    onResetUpdateUser: () => dispatch(actions.resetUpdateUser()),
    onRefreshToken: (value) => dispatch(actions.refreshToken(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmInfoPage);
