import { Formik } from 'formik';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Modal from '../modal/Modal';

const showUser = (props) => {
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

    const { classData, loggedUser, location } = props;

    return (
        <>
            {showModal && (
                <Modal
                    title="Remover turma"
                    body="Você tem certeza que quer remover essa turma?"
                    primaryButtonOnClick={() => props.onRemove(classData.id)}
                    primaryButton="Remover"
                    secondaryButton="Voltar"
                    secondaryButtonOnClick={() => setShowModal(false)}
                />
            )}
            {classData && (
                <Formik
                    initialValues={{
                        name: classData.name,
                        code: classData.code,
                        registerURL: `${location}/class/register/${classData.id}`,
                    }}
                >
                    {({ values, handleChange }) => (
                        <div style={parentInStyle}>
                            <div style={childInStyle}>
                                <Form noValidate>
                                    <div style={{ textAlign: 'justify' }}>
                                        <Form.Group controlId="formTitle">
                                            <Form.Label>Nome</Form.Label>
                                            <Form.Control
                                                name="name"
                                                value={values.name}
                                                type="text"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>
                                    <Form.Group controlId="formLevel">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="registerURL"
                                            value={values.registerURL}
                                            type="text"
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formDateURL" disabled>
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control
                                            name="code"
                                            value={values.code}
                                            type="text"
                                            onChange={handleChange}
                                            disabled={loggedUser.role !== 'ADMIN'}
                                        />
                                    </Form.Group>

                                    <div style={{ textAlign: 'center' }}>
                                        <Form.Group
                                            style={{ width: '150px', display: 'inline-block' }}
                                            controlId="formGridGoogleButton"
                                        >
                                            <Button
                                                style={{ minWidth: '150px' }}
                                                variant="secondary"
                                                type="button"
                                                onClick={props.onGoBack}
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
                                                type="button"
                                                onClick={() => props.onSave(classData.id, values)}
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
            )}
        </>
    );
};

export default showUser;
