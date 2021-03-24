import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SpinnerButton from '../spinnerButton/SpinnerButton';

const createClass = (props) => {
    const schema = Yup.object().shape({
        name: Yup.string().required(),
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
        <Formik validationSchema={schema} initialValues={{ name: '' }}>
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId="formURL" onSubmit={props.submitHandler}>
                                <Form.Label>Nome da Turma</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={values.name}
                                    type="text"
                                    placeholder="Nome da nova turma"
                                    onChange={handleChange}
                                    isInvalid={touched.name && errors.name}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>{' '}
                            <Form.Group
                                style={{ textAlign: 'right', marginTop: '25px', marginBottom: '0' }}
                                controlId="formGridSubmtiButton"
                            >
                                <Button
                                    style={{ width: '100px', marginRight: '7px' }}
                                    variant="secondary"
                                    type="button"
                                    onClick={props.goBack}
                                >
                                    Voltar
                                </Button>
                                {props.loading ? (
                                    <SpinnerButton style={{ width: '100px' }} />
                                ) : (
                                    <Button
                                        style={{ width: '100px' }}
                                        variant="primary"
                                        type="submit"
                                        disabled={!values.name || !isValid}
                                        onClick={() => props.submitHandler(values)}
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

export default createClass;
