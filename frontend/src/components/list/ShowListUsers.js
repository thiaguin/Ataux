import React, { useState } from 'react';
import { Button, Form, Image, Table } from 'react-bootstrap';
import csvImgHover from '../../assets/file-earmark-spreadsheet-fill.svg';
import csvImg from '../../assets/file-earmark-spreadsheet.svg';
import resultTypes from '../../enums/resultTypes';
import { showAcceptedTime } from '../../utils/timeUtils';

const showListUsers = (props) => {
    const [csvButtonHover, setCsvButtonHover] = useState(true);
    const csvImgStyle = { width: '24px', borderRadius: '0.2em', textAlign: 'center' };

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

    const getQuestionStatus = (question) => {
        switch (question.status) {
            case 'BLANK':
                return '';
            case 'OK':
                if (question.acceptedAt) {
                    return `${resultTypes[question.status]} (${showAcceptedTime(question.acceptedAt)})`;
                }
                return `${resultTypes[question.status]}`;
            default:
                return resultTypes[question.status];
        }
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
                                    {props.list.title} - Usuários
                                </h3>
                                {props.loggedUser.role !== 'MEMBER' && (
                                    <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                        <Button
                                            variant="outline-secondary"
                                            style={{ marginRight: '7px' }}
                                            type="button"
                                            onClick={() => props.onClickCSV(props.list.id)}
                                            onMouseEnter={() => setCsvButtonHover(!csvButtonHover)}
                                            onMouseLeave={() => setCsvButtonHover(!csvButtonHover)}
                                        >
                                            <Image src={csvButtonHover ? csvImgHover : csvImg} style={csvImgStyle} />
                                        </Button>
                                        <Button variant="secondary" type="button" onClick={props.goToEditPage}>
                                            Editar Lista
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key" style={{ width: '5%', textAlign: 'center' }}>
                                        {}
                                    </th>
                                    <th key="name">Nome</th>
                                    <th key="handle">Handle</th>
                                    {props.list.questions.map((el) => (
                                        <th key={el.questionId}>{el.question.title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {props.users &&
                                    props.users.map((el, index) => (
                                        <tr key={el.user.id} id={el.id}>
                                            <td key="key" style={{ textAlign: 'center' }}>
                                                {index + 1}
                                            </td>
                                            <td key="name">
                                                {/* <>
                                                <p
                                                    onClick={() =>
                                                        props.onClickQuestion(props.list.id, currQuestion.id)
                                                    }
                                                    onMouseEnter={() => questionNameHoverHandler(currQuestion.id)}
                                                    onMouseLeave={() => questionNameHoverHandler(null)}
                                                    style={
                                                        questionNameHover === currQuestion.id
                                                            ? { textDecoration: 'underline', cursor: 'pointer' }
                                                            : {}
                                                    }
                                                > */}
                                                {el.user.name}
                                                {/* </p>
                                            </> */}
                                            </td>
                                            <td key="handle" style={{ textAlign: 'center' }}>
                                                {el.user.handle}
                                            </td>
                                            {el.questions.map((question) => (
                                                <td key={question.questionId} style={{ textAlign: 'center' }}>
                                                    {getQuestionStatus(question)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        {!props.users || props.users.length === 0 ? (
                            <p style={{ textAlign: 'center' }}>Não foi encontrado nenhum usuário para essa lista</p>
                        ) : null}
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
                                    Ver Questões
                                </Button>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default showListUsers;
