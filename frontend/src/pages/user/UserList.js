import React, { useCallback, useEffect, useState } from 'react';
import { Nav, Pagination, Table } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import Popup from '../../components/popup/Popup';
import * as actions from '../../store/actions';
import userTypes from '../../enums/userTypes';
import Spinner from '../../components/spinner/spinner';

const UserList = (props) => {
    const { user } = props;

    const dispatch = useDispatch();
    const onInitPage = useCallback((...values) => dispatch(actions.getAllUsers(...values)), [dispatch]);

    const [popup, setPopup] = useState(null);
    const [page, setPage] = useState(0);

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

    const users = user.getAll.data;
    const usersCount = users && users.count ? users.count : 0;

    const usersPerPage = 30;
    const initialPage = 0;
    const lastPage = usersCount ? Math.floor((usersCount - 1) / usersPerPage) : 0;

    useEffect(() => {
        onInitPage({ page }, props.token);
    }, [onInitPage, page]);

    useEffect(() => {
        if (user.getAll.error) {
            setPopup(<Popup type="error" message={user.getAll.error} onClose={props.onResetCheckUsers} />);
        }
    }, [user.getAll.error]);

    return (
        <>
            {popup}
            {users && users.data && (
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
                                    Usuários
                                </h3>
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key" style={{ width: '5%', textAlign: 'center' }}>
                                        {}
                                    </th>
                                    <th key="email">Email</th>
                                    <th key="name">Nome</th>
                                    <th key="handle">Handle</th>
                                    <th key="registration" style={{ textAlign: 'center' }}>
                                        Matrícula
                                    </th>
                                    <th key="role" style={{ textAlign: 'center' }}>
                                        Tipo
                                    </th>
                                    <th key="createdAt" style={{ textAlign: 'center' }}>
                                        Data de criação
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((el, index) => (
                                    <tr key={el.id} id={el.id}>
                                        <td key="key" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {index + 1}
                                        </td>
                                        <td key="email" style={{ verticalAlign: 'middle' }}>
                                            {el.email}
                                        </td>
                                        <td key="name" style={{ verticalAlign: 'middle' }}>
                                            <Nav.Link href={`/user/show/${el.id}`} eventKey="link-2">
                                                {el.name}
                                            </Nav.Link>
                                        </td>
                                        <td key="handle" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {el.handle}
                                        </td>
                                        <td key="registration" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {el.registration}
                                        </td>
                                        <td key="role" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {userTypes[el.role]}
                                        </td>
                                        <td key="createdAt" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {el.createdAt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {users.count === 0 && <p style={{ textAlign: 'center' }}>Não foi encontrado nenhum usuário</p>}
                        <Pagination
                            style={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                paginationFirstStyle: {
                                    marginLeft: '5px',
                                    color: 'red',
                                },
                            }}
                        >
                            <Pagination.First onClick={() => setPage(0)} disabled={page === initialPage} />
                            <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === initialPage} />
                            <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === lastPage} />
                            <Pagination.Last onClick={() => setPage(lastPage)} disabled={page === lastPage} />
                        </Pagination>
                    </div>
                </div>
            )}
            {props.user.getAll.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onGetAllUsers: (value) => dispatch(actions.getAllUsers(value)),
    onResetGetAllUsers: () => dispatch(actions.resetGetAllUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
