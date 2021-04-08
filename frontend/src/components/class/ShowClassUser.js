import React, { useState } from 'react';
import { Button, Form, Table, Image } from 'react-bootstrap';
import csvImgHover from '../../assets/file-earmark-spreadsheet-fill.svg';
import csvImg from '../../assets/file-earmark-spreadsheet.svg';
import trashSVG from '../../assets/trash.svg';
import whiteTrashSVG from '../../assets/trash-white.svg';
import Modal from '../modal/Modal';

const showClassUser = (props) => {
    const [removeUser, setRemoveUser] = useState(null);
    const [trashHover, setTrashHover] = useState(-1);
    const [csvButtonHover, setCsvButtonHover] = useState(true);
    const csvImgStyle = { width: '24px', borderRadius: '0.2em', textAlign: 'center' };
    const memberModalBody = 'Você tem certeza que quer sair da turma?';
    const notMemberModalBody = `Você tem certeza que quer remover ${removeUser && removeUser.name} da turma?`;
    const modalBody = props.loggedUser.role === 'MEMBER' ? memberModalBody : notMemberModalBody;

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
            {removeUser && (
                <Modal
                    title="Remover usuário da Turma"
                    body={modalBody}
                    primaryButtonOnClick={() => props.removeUserClassHandler(props.class.id, removeUser.id)}
                    primaryButton="Remover"
                    secondaryButton="Voltar"
                    secondaryButtonOnClick={() => setRemoveUser(null)}
                />
            )}
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
                                {props.loggedUser.role !== 'MEMBER' && (
                                    <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                        <Button
                                            variant="outline-secondary"
                                            style={{ marginRight: '7px' }}
                                            type="button"
                                            onClick={() => props.onClickCSV(props.class.id)}
                                            onMouseEnter={() => setCsvButtonHover(!csvButtonHover)}
                                            onMouseLeave={() => setCsvButtonHover(!csvButtonHover)}
                                        >
                                            <Image src={csvButtonHover ? csvImgHover : csvImg} style={csvImgStyle} />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => props.onAddUser(props.class.id)}
                                        >
                                            Adicionar Usuário na Turma
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
                                            data.lists.map((list, listIndex) => (
                                                <td key={`${listIndex + 1}`} style={{ textAlign: 'center' }}>
                                                    {`${list.resume.OK || 0}/${Object.values(list.resume).reduce(
                                                        (a, b) => a + (b || 0),
                                                        0,
                                                    )}`}
                                                </td>
                                            ))}
                                        {/* {props.loggedUser.role !== 'MEMBER' && ( */}
                                        <td style={{ textAlign: 'center' }}>
                                            <Button
                                                onMouseEnter={() => setTrashHover(index)}
                                                onMouseLeave={() => setTrashHover(-1)}
                                                style={{ padding: '4px 7px' }}
                                                variant="outline-danger"
                                                type="button"
                                                onClick={() =>
                                                    setRemoveUser({ id: data.user.id, name: data.user.name })
                                                }
                                            >
                                                <Image
                                                    style={{
                                                        fill: 'green',
                                                        position: 'relative',
                                                        padding: '0',
                                                    }}
                                                    src={trashHover === index ? whiteTrashSVG : trashSVG}
                                                />
                                            </Button>
                                        </td>
                                        {/* )} */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {props.class.users.length === 0 && (
                            <p style={{ textAlign: 'center' }}>Não foi encontrado nenhum usuário para essa turma</p>
                        )}
                        <div style={{ textAlign: 'center' }}>
                            <Form.Group
                                style={{ width: '150px', display: 'inline-block' }}
                                controlId="formGridGoogleButton"
                            >
                                <Button
                                    style={{ minWidth: '150px' }}
                                    variant="secondary"
                                    type="button"
                                    onClick={() => props.goBack(props.class.id)}
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
