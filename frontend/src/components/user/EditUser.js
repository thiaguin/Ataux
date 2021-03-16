import { Formik } from 'formik';
import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import userTypes from '../../enums/userTypes';

const showUser = (props) => {
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

    const { user, currUser } = props;

    return (
        <>
            {user && (
                <Formik
                    initialValues={{
                        name: user.name,
                        email: user.email,
                        handle: user.handle || '',
                        registration: user.registration || '',
                        role: user.role,
                        confirmed: user.confirmed,
                        createdAt: user.createdAt,
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
                                            name="email"
                                            value={values.email}
                                            type="text"
                                            onChange={handleChange}
                                            disabled={currUser.role !== 'ADMIN'}
                                        />
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formDateURL" disabled>
                                            <Form.Label>Handle</Form.Label>
                                            <Form.Control
                                                name="handle"
                                                value={values.handle}
                                                type="text"
                                                onChange={handleChange}
                                                disabled={currUser.role !== 'ADMIN'}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formTimeURL">
                                            <Form.Label>Matrícula</Form.Label>
                                            <Form.Control
                                                name="registration"
                                                value={values.registration}
                                                onChange={handleChange}
                                                type="text"
                                                disabled={currUser.role !== 'ADMIN'}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formDateURL" disabled>
                                            <Form.Label>Tipo</Form.Label>
                                            <Form.Control
                                                name="role"
                                                value={userTypes[values.role]}
                                                onChange={handleChange}
                                                type="text"
                                                as={currUser.role === 'ADMIN' ? 'select' : 'input'}
                                                disabled={currUser.role !== 'ADMIN'}
                                            >
                                                <>
                                                    <option>{userTypes[values.role]}</option>
                                                    {currUser.role === 'ADMIN'
                                                        ? Object.keys(userTypes).map((role) => (
                                                              <option key={role} value={role}>
                                                                  {userTypes[role]}
                                                              </option>
                                                          ))
                                                        : null}
                                                </>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formDateURL" disabled>
                                            <Form.Label>Criado Em</Form.Label>
                                            <Form.Control
                                                name="createdAt"
                                                value={values.createdAt}
                                                readOnly
                                                type="text"
                                                disabled
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Group controlId="formConfirmed">
                                        <Form.Label />
                                        <Form.Check
                                            type="switch"
                                            label="Confirmado"
                                            checked={user.confirmed}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </Form.Group>
                                    <div style={{ textAlign: 'right' }}>
                                        {user.method === 'LOCAL' && (
                                            <Form.Group
                                                style={{ width: '150px', display: 'inline-block' }}
                                                controlId="formGridGoogleButton"
                                            >
                                                <Button
                                                    style={{ minWidth: '150px' }}
                                                    variant="secondary"
                                                    type="button"
                                                    onClick={props.onClickEditPassword}
                                                >
                                                    Editar Senha
                                                </Button>
                                            </Form.Group>
                                        )}
                                        <Form.Group
                                            controlId="formGridSubmtiButton"
                                            style={{ width: '150px', display: 'inline-block', marginLeft: '15px' }}
                                        >
                                            <Button
                                                style={{ minWidth: '150px' }}
                                                variant="primary"
                                                type="button"
                                                onClick={() => props.onSubmit(values)}
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
