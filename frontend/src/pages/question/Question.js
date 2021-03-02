import React, { useCallback, useEffect, useState } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import { Formik } from 'formik';
import { connect, useDispatch } from 'react-redux';
// import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
// import SpinnerButton from '../../components/spinnerButton/SpinnerButton';
import Popup from '../../components/popup/Popup';
import CreateQuestion from '../../components/question/CreateQuestion';
import ShowQuestion from '../../components/question/ShowQuestion';

const Question = (props) => {
    const { question } = props;
    const { mode, questionId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initQuestion = useCallback((param) => dispatch(actions.getQuestionById(param)), [dispatch]);

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

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && questionId) {
            initQuestion(questionId);
        } else {
            history.push('/question');
        }
    }, [initQuestion, questionId, mode]);

    useEffect(() => {
        if (question.create.error) {
            setPopup(<Popup type="error" message={question.create.error} />);
            props.onResetCreateQuestion();
        }
    }, [question.create.error]);

    useEffect(() => {
        if (question.create.questionId) {
            history.push(`/question/show/${question.create.questionId}`);
        }
    }, [question.create.questionId]);

    return (
        <>
            {popup}
            {mode === 'create' && <CreateQuestion submitHandler={createHandler} loading={question.create.loading} />}
            {mode === 'show' && question.get.question && (
                <ShowQuestion
                    question={question.get.question}
                    goToUrlPage={goToUrlPageHandler}
                    goBack={goBackHandler}
                    gotToEditPage={goToEditPageHandler}
                />
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    question: state.question,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateQuestion: (values) => dispatch(actions.createQuestion(values)),
    onResetCreateQuestion: () => dispatch(actions.resetCreateQuestion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
