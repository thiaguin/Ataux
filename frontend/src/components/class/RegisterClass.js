import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SpinnerButton from '../spinnerButton/SpinnerButton';

const registerClass = (props) => {
    const schema = Yup.object().shape({
        code: Yup.string().required(),
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

    return (
        <Formik validationSchema={schema} initialValues={{ code: '' }}>
            {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate>
                            <Form.Group controlId="formURL">
                                <Form.Label>Código da Turma</Form.Label>
                                <Form.Control
                                    name="code"
                                    value={values.code}
                                    type="text"
                                    placeholder="Código de registro da turma"
                                    onChange={handleChange}
                                    isInvalid={touched.code && errors.code}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                            <Form.Group
                                style={{ textAlign: 'right', marginTop: '25px', marginBottom: '0' }}
                                controlId="formGridSubmtiButton"
                            >
                                {props.loading ? (
                                    <SpinnerButton style={{ width: '100px' }} />
                                ) : (
                                    <Button
                                        style={{ width: '100px' }}
                                        variant="primary"
                                        type="submit"
                                        disabled={!values.code || !isValid}
                                        onClick={() => props.submitHandler(values.code)}
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
    );
};

export default registerClass;
