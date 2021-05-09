import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateList from '../../components/list/CreateList';
import EditList from '../../components/list/EditList';
import ShowListQuestion from '../../components/list/ShowListQuestion';
import ShowListUsers from '../../components/list/ShowListUsers';
import Spinner from '../../components/spinner/spinner';

const List = (props) => {
    const { list } = props;
    const { mode, classId, listId } = props.match.params;
    const QUESTIONS = 'QUESTIONS';
    const USERS = 'USERS';
    const history = useHistory();
    const dispatch = useDispatch();

    const initList = useCallback((...values) => dispatch(actions.getListById(...values)), [dispatch]);

    const [popup, setPopup] = useState(null);
    const [showMode, setShowMode] = useState(QUESTIONS);

    const [listQuestions, setListQuestions] = useState([]);
    const [newQuestionURL, setNewQuestionURL] = useState('');

    const onChangeShowMode = () => {
        setShowMode(showMode === QUESTIONS ? USERS : QUESTIONS);
    };

    const getTime = (dateValue, time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date(dateValue);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        const reseult = new Date(year, month, day, hours, minutes, 0);
        return reseult.toISOString();
    };

    const onEditHandler = (listToEdit, values) => {
        props.onUpdateList(
            listToEdit.id,
            {
                classId: listToEdit.classId,
                expirationTime: getTime(values.expirationDate, values.expirationTime),
                startTime: getTime(values.startDate, values.startTime),
                title: values.title,
                questions: values.questions.map((question) => question.id),
                penalty: values.penalty,
            },
            props.token,
        );
    };

    const onCreateHandler = (values) => {
        props.onCreateList(
            {
                classId,
                expirationTime: getTime(values.expirationDate, values.expirationTime),
                startTime: getTime(values.startDate, values.startTime),
                title: values.title,
                questions: values.questions.map((question) => question.id),
            },
            props.token,
        );
    };

    const onAddQuestionToListHandler = (url) => {
        props.onExistQuestionToList(url, props.token);
    };

    const onGoBackHandler = () => {
        history.goBack();
    };

    const onGoToEditPageHandler = () => {
        history.push(`/list/edit/${listId}`);
    };

    const onRemoveQuestionHandler = (values) => {
        const listQuestionsFiltered = listQuestions.filter((value) => !values.includes(`${value.id}`));
        setListQuestions(listQuestionsFiltered);
    };

    const removeListHandler = (id) => {
        props.onRemoveList(id, props.token);
    };

    const onCheckSubmissionMemberHandler = (questions) => {
        props.onCheckSubmissions({
            token: props.token,
            listId,
            body: { questions: questions.map((el) => el.questionId) },
        });
        setPopup(<Popup type="info" message="Isso pode demorar um pouco" onClose={props.onResetCheckSubmissions} />);
    };

    const onCheckSubmissionNotMemberHandler = (id) => {
        props.onCheckAllUsersSubmissions(id, props.token);
        setPopup(<Popup type="info" message="Isso pode demorar um pouco" onClose={props.onResetCreateList} />);
    };

    const onCheckSubmissionHandler =
        props.loggedUser.role === 'MEMBER' ? onCheckSubmissionMemberHandler : onCheckSubmissionNotMemberHandler;

    const onGetCSVHandler = (id) => {
        props.getListCSV(id, props.token);
    };

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && listId) {
            initList(listId, props.token);
            props.onGetListUsers(listId, props.token);
        } else if (mode !== 'create') {
            history.push('/class');
        }
    }, [initList, listId, mode]);

    useEffect(() => {
        if (list.newQuestion.error) {
            setPopup(
                <Popup type="error" message={list.newQuestion.error} onClose={props.onResetExistQuestionToList} />,
            );
        }
    }, [list.newQuestion.error]);

    useEffect(() => {
        if (list.newQuestion.data) {
            const isDuplicate = listQuestions.some((listQuestion) => listQuestion.id === list.newQuestion.data.id);
            if (!isDuplicate) {
                setListQuestions([...listQuestions, list.newQuestion.data]);
                setNewQuestionURL('');
            }

            props.onResetExistQuestionToList();
        }
    }, [list.newQuestion.data]);

    useEffect(() => {
        if (list.create.error) {
            setPopup(<Popup type="error" message={list.create.error} onClose={props.onResetCreateList} />);
        }
    }, [list.create.error]);

    useEffect(() => {
        if (list.create.listId) {
            history.push(`/list/show/${list.create.listId}`);
        }
    }, [list.create.listId]);

    useEffect(() => {
        if (mode === 'edit' && list.get.data) {
            setListQuestions(list.get.data.questions.map((el) => el.question));
        }
    }, [mode, list.get.data]);

    useEffect(() => {
        if (list.update.success) {
            props.onResetUpdateList();
            history.push(`/list/show/${listId}`);
        }
    }, [list.update.success]);

    useEffect(() => {
        if (list.remove.success) {
            props.onResetRemoveList();
            history.push('/class');
        }
    }, [list.remove.success]);

    useEffect(() => {
        if (list.remove.error) {
            setPopup(<Popup type="error" message={list.remove.error} onClose={props.onResetRemoveList} />);
        }
    }, [list.remove.error]);

    useEffect(() => {
        if (props.submission.check.success) {
            window.location.reload();
        }
    }, [props.submission.check.success]);

    return (
        <>
            {popup}
            {mode === 'create' && (
                <CreateList
                    goBack={onGoBackHandler}
                    loading={list.create.loading}
                    questions={listQuestions}
                    onAddQuestion={onAddQuestionToListHandler}
                    newQuestionLoading={list.newQuestion.loading}
                    onSubmit={onCreateHandler}
                    listQuestions={listQuestions}
                    newQuestionURL={newQuestionURL}
                    removeQuestion={onRemoveQuestionHandler}
                    onNewQuestionURLChange={(value) => setNewQuestionURL(value.target.value)}
                />
            )}
            {mode === 'show' && showMode === QUESTIONS && list.get.data && (
                <ShowListQuestion
                    list={list.get.data}
                    goToEditPage={onGoToEditPageHandler}
                    goBack={onGoBackHandler}
                    gotToListUsersPage={onChangeShowMode}
                    onCheckSubmission={onCheckSubmissionHandler}
                    checkSubmissionLoading={props.submission.check.loading}
                    currentUser={props.loggedUser}
                    usersCount={list.users.data ? list.users.data.length : 0}
                />
            )}
            {mode === 'show' && showMode === USERS && list.get.data && list.users.data && (
                <ShowListUsers
                    onClickQuestion
                    list={list.get.data}
                    users={list.users.data}
                    goToEditPage={onGoToEditPageHandler}
                    goBack={onGoBackHandler}
                    gotToListUsersPage={onChangeShowMode}
                    onClickCSV={onGetCSVHandler}
                    loggedUser={props.loggedUser}
                />
            )}
            {mode === 'edit' && list.get.data && (
                <EditList
                    list={list.get.data}
                    loading={list.update.loading}
                    questions={listQuestions}
                    onAddQuestion={onAddQuestionToListHandler}
                    newQuestionLoading={list.newQuestion.loading}
                    onSubmit={onEditHandler}
                    listQuestions={listQuestions}
                    newQuestionURL={newQuestionURL}
                    removeQuestion={onRemoveQuestionHandler}
                    goBack={onGoBackHandler}
                    onRemove={removeListHandler}
                    onNewQuestionURLChange={(value) => setNewQuestionURL(value.target.value)}
                />
            )}
            {list.get.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    token: state.login.token,
    list: state.list,
    submission: state.submission,
    loggedUser: state.login.user,
});

const mapDispatchToProps = (dispatch) => ({
    onExistQuestionToList: (...values) => dispatch(actions.existQuestionToList(...values)),
    onResetExistQuestionToList: (value) => dispatch(actions.resetExistQuestionToList(value)),
    onCreateList: (...values) => dispatch(actions.createList(...values)),
    onResetCreateList: () => dispatch(actions.resetCreateList()),
    onGetListById: (...values) => dispatch(actions.getListById(...values)),
    onGetListUsers: (...values) => dispatch(actions.getListUsers(...values)),
    onResetGetListUsers: () => dispatch(actions.resetGetListUsers()),
    onUpdateList: (...values) => dispatch(actions.updateList(...values)),
    onResetUpdateList: () => dispatch(actions.resetUpdateList()),
    onCheckSubmissions: (value) => dispatch(actions.checkSubmission(value)),
    onCheckAllUsersSubmissions: (...values) => dispatch(actions.checkAllUsersSubmissions(...values)),
    onResetCheckSubmissions: () => dispatch(actions.resetCheckSubmssions()),
    getListCSV: (...values) => dispatch(actions.getListCSV(...values)),
    onResetGetListCSV: () => dispatch(actions.resetGetListCSV()),
    onRemoveList: (...values) => dispatch(actions.removeList(...values)),
    onResetRemoveList: () => dispatch(actions.resetRemoveList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
