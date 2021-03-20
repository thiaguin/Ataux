import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Modal from '../modal/Modal';

const editTag = (props) => {
    const [showModal, setShowModal] = useState(false);

    const parentInStyle = {
        margin: '5% 25%',
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
        <>
            {showModal && (
                <Modal
                    title="Remover turma"
                    body="Você tem certeza que quer remover essa tag?"
                    primaryButtonOnClick={() => props.onRemove(props.tag.id)}
                    primaryButton="Remover"
                    secondaryButton="Voltar"
                    secondaryButtonOnClick={() => setShowModal(false)}
                />
            )}
            <Formik initialValues={{ name: props.tag.name }}>
                {({ handleSubmit, handleChange, values, isValid }) => (
                    <div style={parentInStyle}>
                        <div style={childInStyle}>
                            <Form noValidate onSubmit={handleSubmit}>
                                <div style={{ textAlign: 'justify' }}>
                                    <Form.Group style={{ width: '83%', display: 'inline-block' }} controlId="formTitle">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            onChange={handleChange}
                                            name="name"
                                            value={values.name}
                                            type="text"
                                        />
                                    </Form.Group>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <Form.Group
                                        style={{ width: '150px', display: 'inline-block' }}
                                        controlId="formGridGoogleButton"
                                    >
                                        <Button
                                            style={{ minWidth: '150px' }}
                                            variant="secondary"
                                            type="button"
                                            onClick={props.goBack}
                                        >
                                            Voltar
                                        </Button>
                                    </Form.Group>
                                    <Form.Group
                                        style={{ width: '150px', display: 'inline-block', marginLeft: '5px' }}
                                        controlId="formGridGoogleButton"
                                    >
                                        <Button
                                            style={{ minWidth: '150px' }}
                                            variant="outline-danger"
                                            type="button"
                                            onClick={() => setShowModal(true)}
                                        >
                                            Remover
                                        </Button>
                                    </Form.Group>
                                    <Form.Group
                                        controlId="formGridSubmtiButton"
                                        style={{ width: '150px', display: 'inline-block', marginLeft: '5px' }}
                                    >
                                        <Button
                                            style={{ minWidth: '150px' }}
                                            variant="primary"
                                            type="submit"
                                            disabled={!isValid}
                                            onClick={() => props.submit(values)}
                                        >
                                            Salvar
                                        </Button>
                                    </Form.Group>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

export default editTag;
