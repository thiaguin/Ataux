import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import levelTypes from '../../enums/levelTypes';

const showListQuestion = (props) => {
    const [questionNameHover, setQuestionNameHover] = useState(false);

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

    const questionNameHoverHandler = (value) => {
        setQuestionNameHover(value);
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
                                    <Button variant="secondary" type="button" onClick={props.goToEditPage}>
                                        Editar Lista
                                    </Button>
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
                                        <td key="key" style={{ textAlign: 'center' }}>
                                            {index + 1}
                                        </td>
                                        <td key="name">
                                            <>
                                                <p
                                                    onClick={() =>
                                                        props.onClickQuestion(props.list.id, currQuestion.questionId)
                                                    }
                                                    onMouseEnter={() => questionNameHoverHandler(currQuestion.id)}
                                                    onMouseLeave={() => questionNameHoverHandler(null)}
                                                    style={
                                                        questionNameHover === currQuestion.id
                                                            ? { textDecoration: 'underline', cursor: 'pointer' }
                                                            : {}
                                                    }
                                                >
                                                    {currQuestion.question.title}
                                                </p>
                                            </>
                                        </td>
                                        <td key="level" style={{ textAlign: 'center' }}>
                                            {levelTypes[currQuestion.question.level]}
                                        </td>
                                        <td key="expirationTime" style={{ textAlign: 'center' }}>
                                            ok
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
                                    Ver Usuários
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
