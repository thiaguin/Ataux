import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import * as actions from '../../store/actions';

const showClassList = (props) => {
    // const dispatch = useDispatch();
    // const onGetAllClasses = useCallback((value) => dispatch(actions.getAllClasses(value)), [dispatch]);

    // const history = useHistory();

    const [classNameHover, setClassNameHover] = useState(false);
    // const [queryName, setQueryName] = useState('');
    // const [page, setPage] = useState(0);
    // const [query, setQuery] = useState({});

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

    const classNameHoverHandler = (value) => {
        setClassNameHover(value);
    };

    return (
        <>
            {props.class && (
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
                                    Listas de Questões da Turma
                                </h3>
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => props.onAddList(props.class.id)}
                                    >
                                        Adicionar Lista
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
                                    <th key="list" style={{ width: '45%' }}>
                                        Lista
                                    </th>
                                    <th key="questionsCount">N° de Questões</th>
                                    <th key="expirationTime">Data de Expiração</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.class.lists.map((currList, index) => (
                                    <tr key={currList.id} id={currList.id}>
                                        <td key="key" style={{ textAlign: 'center' }}>
                                            {index + 1}
                                        </td>
                                        <td key="name">
                                            <>
                                                <p
                                                    onClick={() => props.onClickList(props.class.id, currList.id)}
                                                    onMouseEnter={() => classNameHoverHandler(currList.id)}
                                                    onMouseLeave={() => classNameHoverHandler(null)}
                                                    style={
                                                        classNameHover === currList.id
                                                            ? { textDecoration: 'underline', cursor: 'pointer' }
                                                            : {}
                                                    }
                                                >
                                                    {currList.title}
                                                </p>
                                            </>
                                        </td>
                                        <td key="questionsCount" style={{ textAlign: 'center' }}>
                                            {currList.questions ? currList.questions.length : 0}
                                        </td>
                                        <td key="expirationTime" style={{ textAlign: 'center' }}>
                                            {currList.expirationTime}
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
                                    onClick={() => props.gotToClassUsersPage(props.class.id)}
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

export default showClassList;
