import React, { useCallback, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup, Nav, Pagination, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const ClassList = (props) => {
    const dispatch = useDispatch();
    const onGetAllClasses = useCallback((value) => dispatch(actions.getAllClasses(value)), [dispatch]);

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

    const classesPerPage = 30;
    const initialPage = 0;
    const lastPage = Math.floor((classesCount - 1) / classesPerPage);

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
        onGetAllClasses({});
    };

    useEffect(() => {
        onGetAllClasses({ page, ...query, take: classesPerPage });
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
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    <Button variant="secondary" type="button" onClick={clickAddClassHandler}>
                                        Adicionar Turma
                                    </Button>
                                </div>
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
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
        </>
    );
};

const mapStateToProps = (state) => ({
    classes: state.class.getAll.data,
});

export default connect(mapStateToProps)(ClassList);
