import React, { useState } from 'react';
import { Formik } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import userTypes from '../../enums/userTypes';
import Modal from '../modal/Modal';
import { showTime } from '../../utils/timeUtils';

const editUser = (props) => {
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

    const { user, currUser } = props;

    return (
        <>
            {showModal && (
                <Modal
                    title="Remover turma"
                    body="Você tem certeza que quer remover esse usuário?"
                    primaryButtonOnClick={() => props.onRemove(props.user.id)}
                    primaryButton="Remover"
                    secondaryButton="Voltar"
                    secondaryButtonOnClick={() => setShowModal(false)}
                />
            )}
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
                                        {currUser.role === 'ADMIN' && (
                                            <Form.Group as={Col} controlId="formDateURL" disabled>
                                                <Form.Label>Tipo</Form.Label>
                                                <Form.Control
                                                    name="role"
                                                    value={userTypes[values.role]}
                                                    onChange={handleChange}
                                                    type="text"
                                                    as="select"
                                                >
                                                    <>
                                                        <option>{userTypes[values.role]}</option>?
                                                        {Object.keys(userTypes).map((role) => (
                                                            <option key={role} value={role}>
                                                                {userTypes[role]}
                                                            </option>
                                                        ))}
                                                    </>
                                                </Form.Control>
                                            </Form.Group>
                                        )}
                                        {currUser.role !== 'ADMIN' && (
                                            <Form.Group as={Col} controlId="formDateURL" disabled>
                                            <Form.Label>Handle</Form.Label>
                                            <Form.Control
                                                name="role"
                                                value={userTypes[values.role]}
                                                type="text"
                                                onChange={handleChange}
                                                disabled={currUser.role !== 'ADMIN'}
                                            />
                                            </Form.Group>
                                        )}
                                        <Form.Group as={Col} controlId="formDateURL" disabled>
                                            <Form.Label>Criado Em</Form.Label>
                                            <Form.Control
                                                name="createdAt"
                                                value={showTime(values.createdAt)}
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
                                        <Form.Group
                                            style={{
                                                width: '150px',
                                                display: 'inline-block',
                                            }}
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

                                        {user.method === 'LOCAL' && `${user.id}` === `${currUser.userId}` && (
                                            <Form.Group
                                                style={{ width: '150px', marginLeft: '5px', display: 'inline-block' }}
                                                controlId="formGridGoogleButton"
                                            >
                                                <Button
                                                    style={{ minWidth: '150px' }}
                                                    variant="outline-secondary"
                                                    type="button"
                                                    onClick={props.onClickEditPassword}
                                                >
                                                    Editar Senha
                                                </Button>
                                            </Form.Group>
                                        )}
                                        {props.currUser.role === 'ADMIN' &&
                                            `${user.id}` !== `${props.currUser.userId}` && (
                                                <Form.Group
                                                    style={{
                                                        width: '150px',
                                                        display: 'inline-block',
                                                        marginLeft: '5px',
                                                    }}
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
                                            )}
                                        <Form.Group
                                            controlId="formGridSubmtiButton"
                                            style={{ width: '150px', display: 'inline-block', marginLeft: '5px' }}
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

export default editUser;
