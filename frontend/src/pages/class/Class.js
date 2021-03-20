import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateClass from '../../components/class/CreateClass';
import RegisterClass from '../../components/class/RegisterClass';
import ShowClassList from '../../components/class/ShowClassList';
import ShowClassUser from '../../components/class/ShowClassUser';
import EditClass from '../../components/class/EditClass';

const Class = (props) => {
    const { token, classData, loggedUser } = props;
    const { mode, classId, relation } = props.match.params;

    const location = window.location.origin.toString();

    const history = useHistory();
    const dispatch = useDispatch();

    const initClass = useCallback((...values) => dispatch(actions.getClassResume(...values)), [dispatch]);

    const [popup, setPopup] = useState(null);

    const createHandler = (values) => {
        props.onCreateClass(values, token);
    };

    const goToEditPageHandler = (classIdToEdit) => {
        history.push(`/class/edit/${classIdToEdit}`);
    };

    const goToClassPageHandler = () => {
        history.push('/class');
    };

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

    const goToListPage = (listId) => {
        history.push(`/list/show/${listId}`);
    };

    const goToEditPage = (id) => {
        history.push(`/class/edit/${id}`);
    };

    const goBackHandler = () => {
        history.goBack();
    };

    const registerSubmitHandler = (code) => {
        props.onRegisterClass({ classId, code }, props.token);
    };

    const getCSVHandler = (id) => {
        props.onGetClassCSV(id, token);
    };

    const updateClassHandler = (id, { name, code }) => {
        props.onUpdateClass({ classId: id, name, code }, props.token);
    };

    const removeClassHandler = (id) => {
        props.onRemoveClass(id, props.token);
    };

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && classId) {
            initClass(classId, props.token);
        } else if (!['create', 'register'].includes(mode)) {
            history.push('/class');
        }
    }, [initClass, classId, mode]);

    useEffect(() => {
        if (classData.create.error) {
            setPopup(<Popup type="error" message={classData.create.error} onClose={props.onResetCreateClass} />);
        }
    }, [classData.create.error]);

    useEffect(() => {
        if (classData.register.error) {
            setPopup(<Popup type="error" message={classData.register.error} onClose={props.onResetRegisterClass} />);
        }
    }, [classData.register.error]);

    useEffect(() => {
        if (classData.register.success) {
            history.push(`/class/show/${classId}/list`);
        }
    }, [classData.register.success]);

    useEffect(() => {
        if (classData.update.success) {
            props.onResetUpdateClass();
            history.push(`/class/show/${classId}/list`);
        }
    }, [classData.update.success]);

    useEffect(() => {
        if (classData.remove.success) {
            props.onResetRemoveClass();
            history.push('/class');
        }
    }, [classData.remove.success]);

    useEffect(() => {
        if (classData.create.classId) {
            history.push(`/class/show/${classData.create.classId}/list`);
        }
    }, [classData.create.classId]);

    useEffect(() => {
        if (classData.csv.error) {
            setPopup(<Popup type="error" message={classData.csv.error} onClose={props.onResetGetCSVClass} />);
        }
    }, [classData.csv.error]);

    useEffect(() => {
        if (classData.update.error) {
            setPopup(<Popup type="error" message={classData.update.error} onClose={props.onResetUpdateClass} />);
        }
    }, [classData.update.error]);

    useEffect(() => {
        if (classData.remove.error) {
            setPopup(<Popup type="error" message={classData.remove.error} onClose={props.onResetRemoveClass} />);
        }
    }, [classData.remove.error]);

    return (
        <>
            {popup}
            {loggedUser.role !== 'MEMBER' && mode === 'create' && (
                <CreateClass submitHandler={createHandler} loading={classData.create.loading} />
            )}
            {mode === 'register' && (
                <RegisterClass submitHandler={registerSubmitHandler} loading={classData.register.loading} />
            )}
            {mode === 'show' && relation === 'list' && classData.get.data && (
                <ShowClassList
                    class={classData.get.data}
                    goBack={goToClassPageHandler}
                    gotToEditPage={goToEditPageHandler}
                    onAddList={goToAddListPageHandler}
                    onClickList={goToListPage}
                    gotToClassUsersPage={gotToClassUsersPageHandler}
                    loggedUser={loggedUser}
                    goToEditClass={goToEditPage}
                />
            )}
            {mode === 'show' && relation === 'user' && classData.get.data && (
                <ShowClassUser
                    class={classData.get.data}
                    goBack={gotToClassListsPageHandler}
                    gotToEditPage={goToEditPageHandler}
                    onAddUser={goToAddUserPageHandler}
                    onClickList={goToListPage}
                    gotToClassListsPage={gotToClassListsPageHandler}
                    onClickCSV={getCSVHandler}
                    loggedUser={loggedUser}
                />
            )}
            {mode === 'edit' && classData.get.data && (
                <EditClass
                    loggedUser={loggedUser}
                    location={location}
                    classData={classData.get.data}
                    onGoBack={goBackHandler}
                    onSave={updateClassHandler}
                    onRemove={removeClassHandler}
                />
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    classData: state.class,
    submission: state.submission,
    token: state.login.token,
    loggedUser: state.login.user,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateClass: (...values) => dispatch(actions.createClass(...values)),
    onResetCreateClass: () => dispatch(actions.resetCreateClass()),
    onRegisterClass: (...values) => dispatch(actions.registerClass(...values)),
    onResetRegisterClass: () => dispatch(actions.resetRegisterClass()),
    onGetClassCSV: (...values) => dispatch(actions.getCSVClass(...values)),
    onResetGetCSVClass: () => dispatch(actions.resetGetCSVClass()),
    onUpdateClass: (...values) => dispatch(actions.updateClass(...values)),
    onResetUpdateClass: () => dispatch(actions.resetUpdateClass()),
    onRemoveClass: (...values) => dispatch(actions.removeClass(...values)),
    onResetRemoveClass: () => dispatch(actions.resetRemoveClass()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Class);
