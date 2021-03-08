import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateClass from '../../components/class/CreateClass';
import ShowClassList from '../../components/class/ShowClassList';
import ShowClassUser from '../../components/class/ShowClassUser';

const Class = (props) => {
    const { token, classData } = props;
    const { mode, classId, relation } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initClass = useCallback((param) => dispatch(actions.getClassResume(param)), [dispatch]);

    const [popup, setPopup] = useState(null);

    const createHandler = (values) => {
        props.onCreateClass(values, token);
    };

    const goToEditPageHandler = (classIdToEdit) => {
        history.push(`/class/edit/${classIdToEdit}`);
    };

    // const goBackHandler = () => {
    //     history.goBack();
    // };

    const goToClassPageHandler = () => {
        history.push('/class');
    };

    // const editHandler = (values) => {
    //     props.onUpdateClass({
    //         id: classId,
    //         name: values.name,
    //     });
    // };

    const goToAddListPageHandler = (id) => {
        history.push(`/class/${id}/list/create`);
    };

    const goToAddUserPageHandler = (id) => {
        history.push(`/class/${id}/user/add`);
    };

    const gotToClassUsersPageHandler = (id) => {
        history.push(`/class/show/${id}/user`);
    };

    const gotToClassListsPageHandler = (id) => {
        history.push(`/class/show/${id}/list`);
    };

    const goToListPage = (id, listId) => {
        history.push(`/class/${id}/list/show/${listId}`);
    };

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && classId) {
            initClass(classId);
        } else if (mode !== 'create') {
            history.push('/class');
        }
    }, [initClass, classId, mode]);

    useEffect(() => {
        if (classData.create.error) {
            setPopup(<Popup type="error" message={classData.create.error} />);
            props.onResetCreateClass();
        }
    }, [classData.create.error]);

    useEffect(() => {
        if (classData.create.classId) {
            history.push(`/class/show/${classData.create.classId}`);
        }
    }, [classData.create.classId]);

    // useEffect(() => {
    //     if (classData.update.success) {
    //         props.onResetUpdateClass();
    //         history.push(`/class/show/${classData.get.data.id}`);
    //     }
    // }, [classData.update.success]);

    return (
        <>
            {popup}
            {mode === 'create' && <CreateClass submitHandler={createHandler} loading={classData.create.loading} />}
            {mode === 'show' && relation === 'list' && classData.get.data && (
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
            )}
            {/* mode === 'edit' && classData.get.class && (
                <EditTag tag={classData.get.class} goBack={goBackHandler} submit={editHandler} />
            )} */}
        </>
    );
};

const mapStateToProps = (state) => ({
    classData: state.class,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateClass: (...values) => dispatch(actions.createClass(...values)),
    // onUpdateClass: (values) => dispatch(actions.updateClass(values)),
    onResetCreateClass: () => dispatch(actions.resetCreateClass()),
    // onResetUpdateClass: () => dispatch(actions.resetUpdateClass()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
