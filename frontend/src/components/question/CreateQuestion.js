import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SpinnerButton from '../spinnerButton/SpinnerButton';

const createQuestion = (props) => {
    const schema = Yup.object().shape({
        url: Yup.string().required(),
    });

    const parentInStyle = {
        margin: '12% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid silver',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '7% 15% 5% 10%',
    };

    return (
        <Formik validationSchema={schema} initialValues={{ url: '' }}>
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId="formURL" onSubmit={props.submitHandler}>
                                <Form.Label>Link da Questão</Form.Label>
                                <Form.Control
                                    name="url"
                                    value={values.url}
                                    type="text"
                                    placeholder="Link da Questão no Codeforces"
                                    onChange={handleChange}
                                    isInvalid={touched.url && errors.url}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>{' '}
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
                                        disabled={!values.url || !isValid}
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

export default createQuestion;
