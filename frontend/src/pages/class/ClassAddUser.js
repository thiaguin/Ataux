import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import SpinnerButton from '../../components/spinnerButton/SpinnerButton';
import Popup from '../../components/popup/Popup';

const ClassAddUser = (props) => {
    const history = useHistory();
    const [popup, setPopup] = useState(null);
    const { classId } = props.match.params;
    const schema = Yup.object().shape({
        email: Yup.string().email().required(),
    });

    const parentInStyle = {
        margin: '12% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '7% 15% 5% 10%',
    };

    const addUserHandler = (email) => {
        props.onAddUser({ classId, email }, props.token);
    };

    useEffect(() => {
        if (props.class.error) {
            setPopup(<Popup type="error" message={props.class.error} onClose={props.onResetCreateClass} />);
        }
    }, [props.class.error]);

    useEffect(() => {
        if (props.class.success) {
            history.push(`/class/${classId}`);
        }
    }, [props.class.success]);

    return (
        <>
            {popup}
            <Formik validationSchema={schema} initialValues={{ email: '' }}>
                {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
                    <div style={parentInStyle}>
                        <div style={childInStyle}>
                            <Form noValidate>
                                <Form.Group controlId="formURL">
                                    <Form.Label>Email do novo membro</Form.Label>
                                    <Form.Control
                                        name="email"
                                        value={values.email}
                                        type="text"
                                        placeholder="Email do novo membro"
                                        onChange={handleChange}
                                        isInvalid={touched.email && errors.email}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>{' '}
                                <Form.Group
                                    style={{ textAlign: 'right', marginTop: '25px', marginBottom: '0' }}
                                    controlId="formGridSubmtiButton"
                                >
                                    {props.class.loading ? (
                                        <SpinnerButton style={{ width: '100px' }} />
                                    ) : (
                                        <Button
                                            style={{ width: '100px' }}
                                            variant="primary"
                                            type="submit"
                                            disabled={!values.email || !isValid}
                                            onClick={() => addUserHandler(values.email)}
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
    token: state.login.token,
    class: state.class.addUser,
});

const mapDispatchToProps = (dispatch) => ({
    onAddUser: (...values) => dispatch(actions.addUserClass(...values)),
    onResetAddUser: () => dispatch(actions.resetAddUserClass()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassAddUser);
