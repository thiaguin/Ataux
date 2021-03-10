import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateList from '../../components/list/CreateList';
// import ShowClassList from '../../components/class/ShowClassList';
// import ShowClassUser from '../../components/class/ShowClassUser';

const List = (props) => {
    const { classData, list } = props;
    const { mode, classId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initClass = useCallback((param) => dispatch(actions.getClassResume(param)), [dispatch]);

    const [popup, setPopup] = useState(null);

    // const createHandler = (values) => {
    //     props.onCreateClass(values, token);
    // };

    const [listQuestions, setListQuestions] = useState([]);
    const [newQuestionURL, setNewQuestionURL] = useState('');
    // const goToEditPageHandler = (classIdToEdit) => {
    //     history.push(`/class/edit/${classIdToEdit}`);
    // };

    // const goBackHandler = () => {
    //     history.goBack();
    // };

    // const goToClassPageHandler = () => {
    //     history.push('/class');
    // };

    // const editHandler = (values) => {
    //     props.onUpdateClass({
    //         id: classId,
    //         name: values.name,
    //     });
    // };

    // const goToAddListPageHandler = (id) => {
    //     history.push(`/class/${id}/list/create`);
    // };

    // const goToAddUserPageHandler = (id) => {
    //     history.push(`/class/${id}/user/add`);
    // };

    // const gotToClassUsersPageHandler = (id) => {
    //     history.push(`/class/show/${id}/user`);
    // };

    // const gotToClassListsPageHandler = (id) => {
    //     history.push(`/class/show/${id}/list`);
    // };

    // const goToListPage = (id, listId) => {
    //     history.push(`/class/${id}/list/show/${listId}`);
    // };

    const onCreateHandler = (values) => {
        const [hours, minutes] = values.expirationTime.split(':');
        const expirationDate = new Date(values.expirationDate);
        const year = expirationDate.getUTCFullYear();
        const month = expirationDate.getUTCMonth();
        const day = expirationDate.getUTCDate();
        const expirationTime = new Date(year, month, day, hours, minutes, 59);

        props.onCreateList({
            classId,
            expirationTime: expirationTime.toISOString(),
            title: values.title,
            questions: values.questions.map((question) => question.id),
        });
    };

    const onAddQuestionToListHandler = (url) => {
        props.onExistQuestionToList(url);
    };

    // const onResetExistQuestionToListHandler = () => {
    //     props.onResetExistQuestionToList();
    // };

    const onRemoveQuestionHandler = (values) => {
        const listQuestionsFiltered = listQuestions.filter((value) => !values.includes(`${value.id}`));
        setListQuestions(listQuestionsFiltered);
    };

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && classId) {
            initClass(classId);
        } else if (mode !== 'create') {
            history.push('/class');
        }
    }, [initClass, classId, mode]);

    useEffect(() => {
        if (classData.error) {
            setPopup(<Popup type="error" message={classData.error} />);
            // props.onResetCreateClass();
            props.onResetExistQuestionToList();
        }
    }, [classData.error]);

    useEffect(() => {
        if (list.newQuestion.error) {
            setPopup(<Popup type="error" message={list.newQuestion.error} />);
            props.onResetExistQuestionToList();
        }
    }, [list.newQuestion.error]);

    useEffect(() => {
        if (!classData.data) {
            initClass(classId);
        }
    }, [classData.data]);

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
            setPopup(<Popup type="error" message={list.create.error} />);
            props.onResetCreateList();
        }
    }, [list.create.error]);

    useEffect(() => {
        if (list.create.listId) {
            history.push(`/class/${classId}/list/show/${list.create.listId}`);
        }
    }, [list.create.listId]);

    // useEffect(() => {
    //     if (classData.update.success) {
    //         props.onResetUpdateClass();
    //         history.push(`/class/show/${classData.get.data.id}`);
    //     }
    // }, [classData.update.success]);
    return (
        <>
            {popup}
            {mode === 'create' && (
                <CreateList
                    loading={classData.loading}
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
            {/* {mode === 'show' && relation === 'list' && classData.get.data && (
                <ShowClassList
                    class={classData.get.data}
                    goBack={goToClassPageHandler}
                    gotToEditPage={goToEditPageHandler}
                    onAddList={goToAddListPageHandler}
                    onClickList={goToListPage}
                    gotToClassUsersPage={gotToClassUsersPageHandler}
                />
            )}
            {mode === 'show' && relation === 'user' && classData.get.data && (
                <ShowClassUser
                    class={classData.get.data}
                    goBack={goToClassPageHandler}
                    gotToEditPage={goToEditPageHandler}
                    onAddUser={goToAddUserPageHandler}
                    onClickList={goToListPage}
                    gotToClassListsPage={gotToClassListsPageHandler}
                />
            )} */}
            {/* mode === 'edit' && classData.get.class && (
                <EditTag tag={classData.get.class} goBack={goBackHandler} submit={editHandler} />
            )} */}
        </>
    );
};

const mapStateToProps = (state) => ({
    classData: state.class.get,
    token: state.login.token,
    list: state.list,
});

const mapDispatchToProps = (dispatch) => ({
    onExistQuestionToList: (value) => dispatch(actions.existQuestionToList(value)),
    onResetExistQuestionToList: (value) => dispatch(actions.resetExistQuestionToList(value)),
    onCreateList: (...values) => dispatch(actions.createList(...values)),
    // onUpdateList: (values) => dispatch(actions.updateList(values)),
    onResetCreateList: () => dispatch(actions.resetCreateList()),
    // onResetUpdateList: () => dispatch(actions.resetUpdateList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
