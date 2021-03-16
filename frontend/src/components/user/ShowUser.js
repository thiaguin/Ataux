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

    return (
        <>
            {props.user && (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate>
                            <div style={{ textAlign: 'justify' }}>
                                <Form.Group controlId="formTitle">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control name="name" value={props.user.name} readOnly type="text" disabled />
                                </Form.Group>
                            </div>
                            <Form.Group controlId="formLevel">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" value={props.user.email} readOnly type="text" disabled />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formDateURL" disabled>
                                    <Form.Label>Handle</Form.Label>
                                    <Form.Control
                                        name="handle"
                                        value={props.user.handle || ''}
                                        readOnly
                                        type="text"
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formTimeURL">
                                    <Form.Label>Matrícula</Form.Label>
                                    <Form.Control
                                        name="registration"
                                        value={props.user.registration || ''}
                                        readOnly
                                        type="text"
                                        disabled
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formDateURL" disabled>
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Control
                                        name="role"
                                        value={userTypes[props.user.role]}
                                        readOnly
                                        type="text"
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formDateURL" disabled>
                                    <Form.Label>Criado Em</Form.Label>
                                    <Form.Control
                                        name="createdAt"
                                        value={props.user.createdAt}
                                        readOnly
                                        type="text"
                                        disabled
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Group controlId="formConfirmed">
                                <Form.Label />
                                <Form.Check type="switch" label="Confirmado" checked={props.user.confirmed} disabled />
                            </Form.Group>
                            <div style={{ textAlign: 'right' }}>
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
                                {(props.loggedUser.role === 'ADMIN' ||
                                    `${props.loggedUser.userId}` === `${props.user.id}`) && (
                                    <Form.Group
                                        controlId="formGridSubmtiButton"
                                        style={{ width: '150px', display: 'inline-block', marginLeft: '15px' }}
                                    >
                                        <Button
                                            style={{ minWidth: '150px' }}
                                            variant="primary"
                                            type="submit"
                                            onClick={() => props.onSubmit(props.user.id)}
                                        >
                                            {props.submitButton}
                                        </Button>
                                    </Form.Group>
                                )}
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
};

export default showUser;
