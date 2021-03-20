import React from 'react';
import { Form, Button } from 'react-bootstrap';
import levelTypes from '../../enums/levelTypes';

const showQuestion = (props) => {
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

    const questionTags = props.question.tags || [];

    return (
        <>
            {props.question && (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate>
                            <div style={{ textAlign: 'justify' }}>
                                <Form.Group style={{ width: '83%', display: 'inline-block' }} controlId="formTitle">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control name="title" value={props.question.title} readOnly type="text" />
                                </Form.Group>{' '}
                                <Button
                                    style={{ minWidth: '15%', height: '10%' }}
                                    variant="outline-info"
                                    type="button"
                                    onClick={() => props.onGoToCodeforcesPage(props.question.url)}
                                >
                                    Ir
                                </Button>
                            </div>
                            <Form.Group controlId="formLevel">
                                <Form.Label>Dificuldade</Form.Label>
                                <Form.Control
                                    name="level"
                                    value={levelTypes[props.question.level]}
                                    readOnly
                                    type="text"
                                />
                            </Form.Group>{' '}
                            <Form.Group controlId="formTags" readOnly>
                                <Form.Label>Tags</Form.Label>
                                <Form.Control style={{ height: '150px' }} readOnly as="select" multiple>
                                    {questionTags.map((value) => (
                                        <option key={value.tag.name}>{value.tag.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {/* <Form.Row style={{ textAlign: 'right' }}> */}
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
                                {props.loggedUser.role !== 'MEMBER' && (
                                    <>
                                        <Form.Group
                                            style={{ width: '150px', display: 'inline-block', marginLeft: '5px' }}
                                            controlId="formGridGoogleButton"
                                        >
                                            <Button
                                                style={{ minWidth: '150px' }}
                                                variant="outline-secondary"
                                                type="button"
                                                onClick={() => props.onGoToQuestionCodePage(props.question.id)}
                                            >
                                                Ver Código
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
                                                onClick={() => props.onSubmit(props.question.id)}
                                            >
                                                {props.submitButton}
                                            </Button>
                                        </Form.Group>
                                    </>
                                )}
                            </div>
                            {/* </Form.Row> */}
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
};

export default showQuestion;
