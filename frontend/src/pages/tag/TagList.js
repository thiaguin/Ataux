import React, { useCallback, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup, Nav, Pagination, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const TagList = (props) => {
    const dispatch = useDispatch();
    const onGetAllTags = useCallback((...values) => dispatch(actions.getAllTags(...values)), [dispatch]);

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

    const tagsCount = props.tags && props.tags.count ? props.tags.count : 0;

    const tagsPerPage = 30;
    const initialPage = 0;
    const lastPage = tagsCount > 0 ? Math.floor((tagsCount - 1) / tagsPerPage) : 0;

    const clickAddTagHandler = () => {
        props.onResetCreateTag();
        history.push('/tag/create');
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
        onGetAllTags({}, props.token);
    };

    useEffect(() => {
        onGetAllTags({ page, ...query, take: tagsPerPage }, props.token);
    }, [onGetAllTags, page, query]);

    return (
        <>
            {props.tags && props.tags.data && (
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
                                    Tags
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
                                    <Button variant="secondary" type="button" onClick={clickAddTagHandler}>
                                        Adicionar Tag
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
                                {props.tags.data.map((tag, index) => (
                                    <tr key={tag.id} id={tag.id}>
                                        <td key="key" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {tagsPerPage * page + index + 1}
                                        </td>
                                        <td key="name">
                                            <Nav.Link href={`/tag/show/${tag.id}`} eventKey="link-2">
                                                {tag.name}
                                            </Nav.Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {props.tags.count === 0 && (
                            <p style={{ textAlign: 'center' }}>Não foi encontrado nenhuma tag</p>
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
        </>
    );
};

const mapStateToProps = (state) => ({
    tags: state.tag.getAll.data,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onResetCreateTag: () => dispatch(actions.resetCreateTag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagList);
