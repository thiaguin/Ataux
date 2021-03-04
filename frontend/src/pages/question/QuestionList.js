import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Table, InputGroup, FormControl, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import levelTypes from '../../enums/levelTypes';

const QuestionList = (props) => {
    const dispatch = useDispatch();
    const onGetAllQuestions = useCallback((value) => dispatch(actions.getAllQuestions(value)), [dispatch]);
    const onGetAllTags = useCallback(() => dispatch(actions.getAllTags()), [dispatch]);

    const history = useHistory();
    const [questionNameHover, setQuestionNameHover] = useState(false);
    const [queryName, setQueryName] = useState('');
    const [queryLevel, setQueryLevel] = useState('');
    const [queryTag, setQueryTag] = useState('');

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

    const getPopover = (tags = []) => {
        const tagsNames = tags.map((value) => (
            <div key={value.tag[0].name}>
                {value.tag[0].name}
                <br />
            </div>
        ));

        const popover = (
            <Popover style={{ backgroundColor: '#f5eee0' }} id="key">
                <Popover.Content>{tagsNames} </Popover.Content>
            </Popover>
        );
        return tags.length > 0 ? popover : null;
    };

    const questionNameHoverHandler = (value) => {
        setQuestionNameHover(value);
    };

    const clickAddQuestionHandler = () => {
        history.push('/question/create');
    };

    const onChangeQueryNameHandler = (event) => {
        setQueryName(event.target.value);
    };

    const onChangeQueryLevelHandler = (event) => {
        setQueryLevel(event.target.value);
    };

    const onChangeQueryTagHandler = (event) => {
        setQueryTag(event.target.value);
    };

    const filterHandler = () => {
        const query = {};

        if (queryName !== '') query.title = queryName;
        if (queryLevel !== '') query.level = queryLevel;
        if (queryTag !== '') query.tagId = queryTag;

        onGetAllQuestions(query);
    };

    const goToShowPageHandler = (questionId) => {
        const url = `${window.location.href}/show/${questionId}`;
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const resetFilterHandler = () => {
        setQueryTag('');
        setQueryLevel('');
        setQueryName('');
        onGetAllQuestions({});
    };

    useEffect(() => {
        onGetAllQuestions({});
    }, [onGetAllQuestions]);

    useEffect(() => {
        onGetAllTags();
    }, [onGetAllTags]);

    return (
        <>
            {props.questions && props.questions.data && (
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
                                    Questões
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
                                    <Button variant="secondary" type="button" onClick={clickAddQuestionHandler}>
                                        Adicionar Questão
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key">{}</th>
                                    <th key="name" style={{ width: '45%' }}>
                                        <InputGroup>
                                            <FormControl
                                                onChange={onChangeQueryNameHandler}
                                                placeholder="Nome"
                                                aria-describedby="basic-addon1"
                                                value={queryName}
                                            />
                                        </InputGroup>
                                    </th>
                                    <th key="level">
                                        <InputGroup>
                                            <FormControl
                                                name="level"
                                                onChange={onChangeQueryLevelHandler}
                                                readOnly
                                                defaultValue=""
                                                type="text"
                                                as="select"
                                                placeholder="Nível"
                                                value={queryLevel}
                                            >
                                                <option style={{ display: 'none' }}> Nível </option>
                                                {Object.keys(levelTypes).map((level) => (
                                                    <option key={level} value={level}>
                                                        {levelTypes[level]}
                                                    </option>
                                                ))}
                                            </FormControl>
                                        </InputGroup>
                                    </th>
                                    <th key="tags">
                                        <InputGroup>
                                            <FormControl
                                                name="newTagId"
                                                onChange={onChangeQueryTagHandler}
                                                readOnly
                                                type="text"
                                                as="select"
                                                defaultValue=""
                                                value={queryTag}
                                                placeholder="Tag"
                                            >
                                                <option style={{ display: 'none' }}> Tag </option>
                                                {props.tags &&
                                                    props.tags.data &&
                                                    props.tags.data.map((tag) => (
                                                        <option key={tag.id} value={tag.id}>
                                                            {tag.name}
                                                        </option>
                                                    ))}
                                            </FormControl>
                                        </InputGroup>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.questions.data.map((question, index) => (
                                    <tr key={question.id} id={question.id}>
                                        <td key="key">{index + 1}</td>
                                        <td key="name">
                                            <p
                                                onClick={() => goToShowPageHandler(question.id)}
                                                onMouseEnter={() => questionNameHoverHandler(question.id)}
                                                onMouseLeave={() => questionNameHoverHandler(null)}
                                                style={
                                                    questionNameHover === question.id
                                                        ? { textDecoration: 'underline', cursor: 'pointer' }
                                                        : {}
                                                }
                                            >
                                                {question.title}
                                            </p>
                                        </td>
                                        <td key="level" style={{ textAlign: 'center' }}>
                                            {levelTypes[question.level]}
                                        </td>
                                        <td key="tags" style={{ textAlign: 'center' }}>
                                            <OverlayTrigger placement="left" overlay={getPopover(question.tags)}>
                                                <p>{`${question.tags.length} tags`}</p>
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    questions: state.question.getAll.questions,
    tags: state.tag.getAll.data,
});

// const mapDispatchToProps = () => {};
export default connect(mapStateToProps, null)(QuestionList);
