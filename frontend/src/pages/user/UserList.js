import React, { useCallback, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup, Nav, Pagination, Table } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import Popup from '../../components/popup/Popup';
import * as actions from '../../store/actions';
import userTypes from '../../enums/userTypes';
import Spinner from '../../components/spinner/spinner';
import { showTime } from '../../utils/timeUtils';

const UserList = (props) => {
    const { user } = props;

    const dispatch = useDispatch();
    const onInitPage = useCallback((...values) => dispatch(actions.getAllUsers(...values)), [dispatch]);

    const [queryEmail, setQueryEmail] = useState('');
    const [queryName, setQueryName] = useState('');
    const [queryHandle, setQueryHandle] = useState('');
    const [queryRegistration, setQueryRegistration] = useState('');
    const [queryRole, setQueryRole] = useState('');

    const [popup, setPopup] = useState(null);
    const [query, setQuery] = useState({});
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

    const onChangeQueryEmailHandler = (event) => {
        setQueryEmail(event.target.value);
    };

    const onChangeQueryNameHandler = (event) => {
        setQueryName(event.target.value);
    };

    const onChangeQueryHandleHandler = (event) => {
        setQueryHandle(event.target.value);
    };

    const onChangeQueryRegistrationHandler = (event) => {
        setQueryRegistration(event.target.value);
    };

    const onChangeQueryRoleHandler = (event) => {
        setQueryRole(event.target.value);
    };

    const resetFilterHandler = () => {
        setQueryEmail('');
        setQueryName('');
        setQueryHandle('');
        setQueryRegistration('');
        setQueryRole('');
        setQuery({});
        onInitPage({ page: 0 }, props.token);
    };

    const filterHandler = () => {
        const queryParams = {};

        if (queryName !== '') queryParams.name = queryName;
        if (queryEmail !== '') queryParams.email = queryEmail;
        if (queryHandle !== '') queryParams.handle = queryHandle;
        if (queryRegistration !== '') queryParams.registration = queryRegistration;
        if (queryRole !== '') queryParams.role = queryRole;

        setPage(initialPage);
        setQuery(queryParams);
    };

    useEffect(() => {
        onInitPage({ page, ...query }, props.token);
    }, [onInitPage, page, query]);

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
                                <Button style={{ display: 'inline-block' }} onClick={filterHandler} variant="secondary">
                                    Filtrar
                                </Button>
                                <Button
                                    style={{ display: 'inline-block', marginLeft: '10px' }}
                                    onClick={resetFilterHandler}
                                    variant="outline-secondary"
                                >
                                    Resetar Filtros
                                </Button>
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key" style={{ width: '5%', textAlign: 'center' }}>
                                        {}
                                    </th>
                                    <th key="email">
                                        <InputGroup>
                                            <FormControl
                                                onChange={onChangeQueryEmailHandler}
                                                placeholder="Email"
                                                aria-describedby="basic-addon1"
                                                value={queryEmail}
                                            />
                                        </InputGroup>
                                    </th>
                                    <th key="name">
                                        <InputGroup>
                                            <FormControl
                                                onChange={onChangeQueryNameHandler}
                                                placeholder="Nome"
                                                aria-describedby="basic-addon1"
                                                value={queryName}
                                            />
                                        </InputGroup>
                                    </th>
                                    <th key="handle">
                                        <InputGroup>
                                            <FormControl
                                                onChange={onChangeQueryHandleHandler}
                                                placeholder="Handle"
                                                aria-describedby="basic-addon1"
                                                value={queryHandle}
                                            />
                                        </InputGroup>
                                    </th>
                                    <th key="registration" style={{ textAlign: 'center' }}>
                                        <InputGroup>
                                            <FormControl
                                                onChange={onChangeQueryRegistrationHandler}
                                                placeholder="Matrícula"
                                                aria-describedby="basic-addon1"
                                                value={queryRegistration}
                                            />
                                        </InputGroup>
                                    </th>
                                    <th key="role" style={{ textAlign: 'center' }}>
                                        <InputGroup>
                                            <FormControl
                                                name="level"
                                                onChange={onChangeQueryRoleHandler}
                                                readOnly
                                                type="text"
                                                as="select"
                                                placeholder="Tipo"
                                                value={queryRole}
                                            >
                                                <option style={{ display: 'none' }}> Tipo </option>
                                                {Object.keys(userTypes).map((role) => (
                                                    <option key={role} value={role}>
                                                        {userTypes[role]}
                                                    </option>
                                                ))}
                                            </FormControl>
                                        </InputGroup>
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
                                            {usersPerPage * page + index + 1}
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
                                            {showTime(el.createdAt)}
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
