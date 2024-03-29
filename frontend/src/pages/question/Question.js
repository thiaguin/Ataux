import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateQuestion from '../../components/question/CreateQuestion';
import ShowQuestion from '../../components/question/ShowQuestion';
import EditQuestion from '../../components/question/EditQuestion';
import QuestionCode from '../../components/question/QuestionCode';
import Spinner from '../../components/spinner/spinner';

const Question = (props) => {
    const { question, tags, loggedUser } = props;
    const { mode, questionId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initQuestion = useCallback((...values) => dispatch(actions.getQuestionById(...values)), [dispatch]);
    const initEditPage = useCallback(() => dispatch(actions.getAllTags({ take: 'ALL' }, props.token)), [dispatch]);

    const [popup, setPopup] = useState(null);

    const createHandler = (values) => {
        props.onCreateQuestion(values, props.token);
    };

    const goToUrlPageHandler = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const goToEditPageHandler = (questionIdToEdit) => {
        history.push(`/question/edit/${questionIdToEdit}`);
    };

    const goBackHandler = () => {
        history.goBack();
    };

    const allTags = tags && tags.data ? tags.data : [];

    const [questionTags, setQuestionTags] = useState([]);

    const addTagHandler = (newTagId) => {
        const [tagToAdd] = allTags.filter((tag) => `${tag.id}` === newTagId);
        const [hasTag] = questionTags.filter((tag) => `${tag.id}` === newTagId);

        if (!hasTag && tagToAdd) {
            setQuestionTags([...questionTags, { id: tagToAdd.id, name: tagToAdd.name }]);
        }
    };

    const removeTagHandler = (tagsIds) => {
        const questionsFiltered = questionTags.filter((value) => !tagsIds.includes(`${value.id}`));
        setQuestionTags(questionsFiltered);
    };

    const goToQuestionCodePage = (questionIdToShowCode) => {
        history.push(`/question/code/${questionIdToShowCode}`);
    };

    const removeQuestionHandler = (id) => {
        props.onRemoveQuestion(id, props.token);
    };
    const editHandler = (values) => {
        props.onUpdateQuestion({
            tags: questionTags.map((value) => value.id),
            id: questionId,
            token: props.token,
            level: values.level,
        });
    };

    const editCodeHandler = (code) => {
        props.onUpdateQuestion({
            id: questionId,
            token: props.token,
            resolution: code,
        });
    };

    useEffect(() => {
        if (['edit', 'show', 'code'].includes(mode) && questionId) {
            initQuestion(questionId, props.token);
        } else if (mode !== 'create') {
            history.push('/question');
        }
    }, [initQuestion, questionId, mode]);

    useEffect(() => {
        if (question.create.error) {
            setPopup(<Popup type="error" message={question.create.error} onClose={props.onResetCreateQuestion} />);
        }
    }, [question.create.error]);

    useEffect(() => {
        if (question.create.questionId) {
            history.push(`/question/show/${question.create.questionId}`);
        }
    }, [question.create.questionId]);

    useEffect(() => {
        if (mode && mode === 'edit') {
            initEditPage();
        }
    }, [initEditPage, mode]);

    useEffect(() => {
        if (question.get.data) {
            setQuestionTags(question.get.data.tags.map((value) => ({ id: value.tag.id, name: value.tag.name })));
        }
    }, [question.get.data]);

    useEffect(() => {
        if (question.update.success) {
            props.onResetUpdateQuestion();
            history.push(`/question/show/${question.get.data.id}`);
        }
    }, [question.update.success]);

    useEffect(() => {
        if (question.remove.success) {
            props.onResetRemoveQuestion();
            history.push('/question');
        }
    }, [question.remove.success]);

    useEffect(() => {
        if (question.remove.error) {
            setPopup(<Popup type="error" message={question.remove.error} onClose={props.onResetRemoveQuestion} />);
        }
    }, [question.remove.error]);

    return (
        <>
            {popup}
            {loggedUser.role !== 'MEMBER' && mode === 'create' && (
                <CreateQuestion
                    goBack={goBackHandler}
                    submitHandler={createHandler}
                    loading={question.create.loading}
                />
            )}
            {mode === 'show' && question.get.data && (
                <ShowQuestion
                    question={question.get.data}
                    goBack={goBackHandler}
                    onSubmit={goToEditPageHandler}
                    onGoToQuestionCodePage={goToQuestionCodePage}
                    onGoToCodeforcesPage={goToUrlPageHandler}
                    loggedUser={loggedUser}
                    submitButton="Editar"
                />
            )}
            {loggedUser.role !== 'MEMBER' && mode === 'edit' && question.get.data && (
                <EditQuestion
                    question={question.get.data}
                    goToUrlPage={goToUrlPageHandler}
                    goBack={goBackHandler}
                    questionTags={questionTags}
                    tags={allTags}
                    addQuestionTag={addTagHandler}
                    submit={editHandler}
                    removeTag={removeTagHandler}
                    onRemove={removeQuestionHandler}
                />
            )}
            {loggedUser.role !== 'MEMBER' && mode === 'code' && question.get.data && (
                <QuestionCode question={question.get.data} onSaveCode={editCodeHandler} />
            )}
            {question.get.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    question: state.question,
    loggedUser: state.login.user,
    tags: state.tag.getAll.data,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateQuestion: (...values) => dispatch(actions.createQuestion(...values)),
    onResetCreateQuestion: () => dispatch(actions.resetCreateQuestion()),
    onUpdateQuestion: (values) => dispatch(actions.updateQuestion(values)),
    onResetUpdateQuestion: () => dispatch(actions.resetUpdateQuestion()),
    onRemoveQuestion: (...values) => dispatch(actions.removeQuestion(...values)),
    onResetRemoveQuestion: () => dispatch(actions.resetRemoveQuestion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
