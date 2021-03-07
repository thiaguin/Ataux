import React, { useCallback, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup, Pagination, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const TagList = (props) => {
    const dispatch = useDispatch();
    const onGetAllTags = useCallback((value) => dispatch(actions.getAllTags(value)), [dispatch]);

    const history = useHistory();

    const [tagNameHover, setTagNameHover] = useState(false);
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
    const lastPage = Math.floor((tagsCount - 1) / tagsPerPage);

    const tagNameHoverHandler = (value) => {
        setTagNameHover(value);
    };

    const clickAddTagHandler = () => {
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

    const goToShowPageHandler = (tagId) => {
        const url = `${window.location.href}/show/${tagId}`;
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const resetFilterHandler = () => {
        setQueryName('');
        onGetAllTags({});
    };

    useEffect(() => {
        onGetAllTags({ page, ...query, take: tagsPerPage });
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
                                        <td key="key">{tagsPerPage * page + index + 1}</td>
                                        <td key="name">
                                            <>
                                                <p
                                                    onClick={() => goToShowPageHandler(tag.id)}
                                                    onMouseEnter={() => tagNameHoverHandler(tag.id)}
                                                    onMouseLeave={() => tagNameHoverHandler(null)}
                                                    style={
                                                        tagNameHover === tag.id
                                                            ? { textDecoration: 'underline', cursor: 'pointer' }
                                                            : {}
                                                    }
                                                >
                                                    {tag.name}
                                                </p>
                                            </>
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
    tags: state.tag.getAll.data,
});

export default connect(mapStateToProps)(TagList);
