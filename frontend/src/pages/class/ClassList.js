import React, { useCallback, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup, Nav, Pagination, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../store/actions';
import Spinner from '../../components/spinner/spinner';

const ClassList = (props) => {
    const dispatch = useDispatch();
    const onGetAllClasses = useCallback((...values) => dispatch(actions.getAllClasses(...values)), [dispatch]);

    const history = useHistory();

    const [queryName, setQueryName] = useState('');
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState({});

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

    const classesCount = props.classes && props.classes.count ? props.classes.count : 0;

    const location = window.location.origin.toString();

    const classesPerPage = 30;
    const initialPage = 0;
    const lastPage = classesCount ? Math.floor((classesCount - 1) / classesPerPage) : 0;

    const clickAddClassHandler = () => {
        history.push('/class/create');
    };

    const onChangeQueryNameHandler = (event) => {
        setQueryName(event.target.value);
    };

    const filterHandler = () => {
        const queryParams = {};

        if (queryName !== '') queryParams.name = queryName;

        setQuery(queryParams);
    };

    const resetFilterHandler = () => {
        setQueryName('');
        onGetAllClasses({}, props.token);
    };

    useEffect(() => {
        onGetAllClasses({ page, ...query, take: classesPerPage }, props.token);
    }, [onGetAllClasses, page, query]);

    return (
        <>
            {props.classes && props.classes.data && (
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
                                    Turmas
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
                                {props.loggedUser.role !== 'MEMBER' && (
                                    <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                        <Button variant="secondary" type="button" onClick={clickAddClassHandler}>
                                            Adicionar Turma
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key" style={{ width: '5%' }}>
                                        {}
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
                                    {props.currentUser.role !== 'MEMBER' && (
                                        <>
                                            <th key="registerURL" style={{ verticalAlign: 'middle' }}>
                                                Link para registro
                                            </th>
                                            <th key="code" style={{ verticalAlign: 'middle' }}>
                                                Código de registro
                                            </th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {props.classes.data.map((currClass, index) => (
                                    <tr key={currClass.id} id={currClass.id}>
                                        <td key="key" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {classesPerPage * page + index + 1}
                                        </td>
                                        <td key="name">
                                            <Nav.Link href={`/class/show/${currClass.id}/list`} eventKey="link-2">
                                                {currClass.name}
                                            </Nav.Link>
                                        </td>
                                        {props.currentUser.role !== 'MEMBER' && (
                                            <>
                                                <td
                                                    key="registerURL"
                                                    style={{ verticalAlign: 'middle' }}
                                                >{`${location}/class/register/${currClass.id}`}</td>
                                                <td key="code" style={{ verticalAlign: 'middle' }}>
                                                    {currClass.code}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {props.classes.count === 0 && (
                            <p style={{ textAlign: 'center' }}>Não foi encontrado nenhuma turma</p>
                        )}
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
            {props.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    token: state.login.token,
    currentUser: state.login.user,
    classes: state.class.getAll.data,
    loading: state.class.getAll.loading,
    loggedUser: state.login.user,
});

export default connect(mapStateToProps)(ClassList);
