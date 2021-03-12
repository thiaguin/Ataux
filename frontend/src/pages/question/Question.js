import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateQuestion from '../../components/question/CreateQuestion';
import ShowQuestion from '../../components/question/ShowQuestion';
import EditQuestion from '../../components/question/EditQuestion';

const Question = (props) => {
    const { question, tags } = props;
    const { mode, questionId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initQuestion = useCallback((param) => dispatch(actions.getQuestionById(param)), [dispatch]);
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

    const editHandler = (values) => {
        props.onUpdateQuestion({
            tags: questionTags.map((value) => value.id),
            id: questionId,
            level: values.level,
        });
    };

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && questionId) {
            initQuestion(questionId);
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
            {mode === 'create' && <CreateQuestion submitHandler={createHandler} loading={question.create.loading} />}
            {mode === 'show' && question.get.data && (
                <ShowQuestion
                    question={question.get.data}
                    goBack={goBackHandler}
                    onSubmit={goToEditPageHandler}
                    submitButton="Editar"
                />
            )}
            {mode === 'edit' && question.get.data && (
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
        </>
    );
};

const mapStateToProps = (state) => ({
    question: state.question,
    tags: state.tag.getAll.data,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateQuestion: (values) => dispatch(actions.createQuestion(values)),
    onUpdateQuestion: (values) => dispatch(actions.updateQuestion(values)),
    onResetCreateQuestion: () => dispatch(actions.resetCreateQuestion()),
    onResetUpdateQuestion: () => dispatch(actions.resetUpdateQuestion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
