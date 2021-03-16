import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateQuestion from '../../components/question/CreateQuestion';
import ShowQuestion from '../../components/question/ShowQuestion';
import EditQuestion from '../../components/question/EditQuestion';
import QuestionCode from '../../components/question/QuestionCode';

const Question = (props) => {
    const { question, tags, loggedUser } = props;
    const { mode, questionId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initQuestion = useCallback((...values) => dispatch(actions.getQuestionById(...values)), [dispatch]);
    const initEditPage = useCallback(() => dispatch(actions.getAllTags({ take: 'ALL' })), [dispatch]);

    const [popup, setPopup] = useState(null);

    const createHandler = (values) => {
        props.onCreateQuestion(values);
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

    const editHandler = (values) => {
        props.onUpdateQuestion({
            tags: questionTags.map((value) => value.id),
            id: questionId,
            level: values.level,
        });
    };

    const editCodeHandler = (code) => {
        props.onUpdateQuestion({
            id: questionId,
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

    return (
        <>
            {popup}
            {loggedUser.role !== 'MEMBER' && mode === 'create' && (
                <CreateQuestion submitHandler={createHandler} loading={question.create.loading} />
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
                />
            )}
            {loggedUser.role !== 'MEMBER' && mode === 'code' && question.get.data && (
                <QuestionCode question={question.get.data} onSaveCode={editCodeHandler} />
            )}
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
    onCreateQuestion: (values) => dispatch(actions.createQuestion(values)),
    onUpdateQuestion: (values) => dispatch(actions.updateQuestion(values)),
    onResetCreateQuestion: () => dispatch(actions.resetCreateQuestion()),
    onResetUpdateQuestion: () => dispatch(actions.resetUpdateQuestion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
