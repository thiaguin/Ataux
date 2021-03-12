import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const showClassUser = (props) => {
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
                                    Usuários da Turma
                                </h3>
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => props.onAddUser(props.class.id)}
                                    >
                                        Adicionar Usuário na Turma
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
                                    <th key="name">Nome</th>
                                    <th key="handle">Handle</th>
                                    <th key="registration">Matrícula</th>
                                    {props.class.lists.map((list) => (
                                        <th key={list.id}>{list.title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {props.class.users.map((data, index) => (
                                    <tr key={data.id} id={data.id}>
                                        <td key="key" style={{ textAlign: 'center' }}>
                                            {index + 1}
                                        </td>
                                        <td key="name">
                                            <>
                                                {/* <p
                                                    onClick={() => props.onClickList(props.class.id, currList.id)}
                                                    onMouseEnter={() => classNameHoverHandler(currList.id)}
                                                    onMouseLeave={() => classNameHoverHandler(null)}
                                                    style={
                                                        classNameHover === currList.id
                                                            ? { textDecoration: 'underline', cursor: 'pointer' }
                                                            : {}
                                                    }
                                                > */}
                                                {data.user.name}
                                                {/* </p> */}
                                            </>
                                        </td>
                                        <td key="handle">{data.user.handle}</td>
                                        <td key="registration">{data.user.registration}</td>
                                        {data.lists &&
                                            data.lists.map((list) => (
                                                <td key="handle" style={{ textAlign: 'center' }}>
                                                    {`${list.resume.OK || 0}/${Object.values(list.resume).reduce(
                                                        (a, b) => a + (b || 0),
                                                        0,
                                                    )}`}
                                                </td>
                                            ))}
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
                                    onClick={() => props.gotToClassListsPage(props.class.id)}
                                >
                                    Ver Listas
                                </Button>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default showClassUser;
