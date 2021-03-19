import React from 'react';
import { Button, Form, Nav, Table } from 'react-bootstrap';
import levelTypes from '../../enums/levelTypes';
import SpinnerButton from '../spinnerButton/SpinnerButton';
import resultTypes from '../../enums/resultTypes';

const showListQuestion = (props) => {
    const parentInStyle = {
        margin: '5%',
        width: '90%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '100%',
        margin: '0',
    };

    return (
        <>
            {props.list && (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <div style={{ margin: '10px 30px' }}>
                            <div>
                                <h3
                                    style={{
                                        margin: '0',
                                        marginRight: '15px',
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        color: 'grey',
                                    }}
                                >
                                    {props.list.title} - Questões
                                </h3>
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    {props.currentUser.role === 'MEMBER' &&
                                        (props.checkSubmissionLoading ? (
                                            <SpinnerButton
                                                buttonVariant="secondary"
                                                style={{ width: '100px', height: '10%' }}
                                            />
                                        ) : (
                                            <Button
                                                style={{ display: 'inline-block' }}
                                                onClick={() => props.onCheckSubmission(props.list.questions)}
                                                variant="secondary"
                                            >
                                                Atualizar
                                            </Button>
                                        ))}
                                    {props.currentUser.role !== 'MEMBER' && (
                                        <Button variant="secondary" type="button" onClick={props.goToEditPage}>
                                            Editar Lista
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key" style={{ width: '5%', textAlign: 'center' }}>
                                        {}
                                    </th>
                                    <th key="question" style={{ width: '45%' }}>
                                        Questão
                                    </th>
                                    <th key="level">Dificuldade</th>
                                    <th key="status">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.list.questions.map((currQuestion, index) => (
                                    <tr key={currQuestion.id} id={currQuestion.id}>
                                        <td key="key" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {index + 1}
                                        </td>
                                        <td key="name">
                                            <Nav.Link
                                                href={`/list/${props.list.id}/question/show/${currQuestion.questionId}`}
                                                eventKey="link-2"
                                            >
                                                {currQuestion.question.title}
                                            </Nav.Link>
                                        </td>
                                        <td key="level" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {levelTypes[currQuestion.question.level]}
                                        </td>
                                        <td
                                            key="expirationTime"
                                            style={{ textAlign: 'center', verticalAlign: 'middle' }}
                                        >
                                            {props.currentUser.role === 'MEMBER'
                                                ? resultTypes[currQuestion.status]
                                                : `${currQuestion.status}/${props.usersCount}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
                                controlId="formGridSubmtiButton"
                                style={{ width: '150px', display: 'inline-block', marginLeft: '15px' }}
                            >
                                <Button
                                    style={{ minWidth: '150px' }}
                                    variant="primary"
                                    type="submit"
                                    onClick={() => props.gotToListUsersPage(props.list.id)}
                                >
                                    {props.currentUser.role === 'MEMBER' ? 'Ver Resumo' : 'Ver Usuários'}
                                </Button>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default showListQuestion;
