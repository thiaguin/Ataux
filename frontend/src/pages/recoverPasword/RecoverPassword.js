import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Form, Button, Toast } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';

const RecoverPassword = (props) => {
    const [popup, setPopup] = useState(null);
    const [toastClosed, setToastClosed] = useState(false);

    const history = useHistory();

    const schema = Yup.object().shape({
        email: Yup.string().email().required(),
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
        margin: '8% 10% 3% 10%',
    };

    const submitHandler = (values) => {
        props.onSubmit(values);
    };

    const goBackHandler = () => {
        props.onResetRecoverPassword();
        history.goBack();
    };

    const SubmitButton = ({ values, disabled }) => (
        <Button type="submit" onClick={() => submitHandler(values)} variant="primary" disabled={disabled}>
            Enviar
        </Button>
    );

    const BackToLoginButton = () => (
        <Button type="submit" onClick={() => goBackHandler()} variant="primary">
            Voltar
        </Button>
    );

    const closeToastHandler = () => {
        setToastClosed(true);
    };

    useEffect(() => {
        if (props.data.error) {
            setPopup(<Popup type="error" message={props.data.error} />);
            props.onResetRecoverPassword();
        }
    }, [props.data.error]);

    return (
        <>
            <Formik validationSchema={schema} initialValues={{ email: '' }}>
                {({ handleSubmit, handleBlur, values, touched, errors, handleChange, isValid }) => (
                    <div style={parentInStyle}>
                        <div style={childInStyle}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formEmail" onSubmit={() => submitHandler(values)}>
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
                                    <Form.Text className="text-muted">
                                        Será enviado um email para recuperação de senha.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formGridToast">
                                    <Toast
                                        show={props.data.success && !toastClosed}
                                        onClose={() => closeToastHandler()}
                                    >
                                        <Toast.Header>
                                            <strong className="mr-auto">Email enviado</strong>
                                        </Toast.Header>
                                        <Toast.Body>
                                            Será enviado um email para você em instantes, caso não receba tente
                                            novamente
                                        </Toast.Body>
                                    </Toast>
                                </Form.Group>
                                <Form.Group style={{ textAlign: 'right' }} controlId="formGridSubmtiButton">
                                    {props.data.success ? (
                                        <BackToLoginButton />
                                    ) : (
                                        <SubmitButton values={values} disabled={!isValid} />
                                    )}
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
            {popup}
        </>
    );
};

const mapStateToProps = (state) => ({
    data: state.recoverPassword,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (values) => dispatch(actions.recoverPassword(values)),
    onResetRecoverPassword: () => dispatch(actions.resetRecoverPassword()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPassword);
