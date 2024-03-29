import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import ShowUser from '../../components/user/ShowUser';
import EditUser from '../../components/user/EditUser';
import EditPasswordUser from '../../components/user/EditPasswordUser';
import Popup from '../../components/popup/Popup';
import Spinner from '../../components/spinner/spinner';

const User = (props) => {
    const { user, login, loggedUser } = props;
    const { mode, userId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initUser = useCallback((...values) => dispatch(actions.getUserById(...values)), [dispatch]);

    const [popup, setPopup] = useState(null);

    const goToEditPageHandler = (id) => {
        history.push(`/user/edit/${id}`);
    };

    const goBackHandler = () => {
        history.goBack();
    };

    const editHandler = (values) => {
        props.onUpdateUser({ ...values, userId, token: props.token });
    };

    const editPasswordHandler = ({ currentPassword, newPassword }) => {
        props.onUpdateUserPassword({ currentPassword, newPassword, userId, token: props.token });
    };

    const goToEditPasswordPageHandler = () => {
        history.push(`/user/updatePassword/${userId}`);
    };

    const removeUserHandle = (id) => {
        props.onRemoveUser(id, props.token);
    };

    useEffect(() => {
        if (['edit', 'show', 'updatePassword'].includes(mode) && userId) {
            initUser(userId, props.token);
        }
    }, [initUser, userId, mode]);

    useEffect(() => {
        if (user.update.success) {
            props.onResetUpdateUser();
            history.push(`/user/show/${userId}`);
        }
    }, [user.update.success]);

    useEffect(() => {
        if (user.update.error) {
            setPopup(<Popup type="error" message={user.update.error} onClose={props.onResetUpdateUser} />);
        }
    }, [user.update.error]);

    useEffect(() => {
        if (user.remove.success) {
            props.onReseteRemoveUser();
            history.push('/user');
        }
    }, [user.remove.success]);

    useEffect(() => {
        if (user.remove.error) {
            setPopup(<Popup type="error" message={user.remove.error} onClose={props.onReseteRemoveUser} />);
        }
    }, [user.remove.error]);

    return (
        <>
            {mode === 'show' && loggedUser.role === 'MEMBER' && `${loggedUser.userId}` !== `${userId}` && (
                <Redirect to="/question" />
            )}
            {popup}
            {mode === 'show' && user.get.data && (
                <ShowUser
                    user={user.get.data}
                    goBack={goBackHandler}
                    onSubmit={goToEditPageHandler}
                    submitButton="Editar"
                    loggedUser={loggedUser}
                />
            )}
            {loggedUser.role !== 'ADMIN' && `${loggedUser.id}` !== `${userId}` && (
                <Redirect to={`/user/show/${userId}`} />
            )}
            {mode === 'edit' && user.get.data && (
                <EditUser
                    user={user.get.data}
                    onClickEditPassword={goToEditPasswordPageHandler}
                    onSubmit={editHandler}
                    currUser={login.user}
                    onRemove={removeUserHandle}
                    goBack={goBackHandler}
                />
            )}
            {mode === 'updatePassword' && user.get.data && (
                <EditPasswordUser
                    user={user.get.data}
                    onSubmit={editPasswordHandler}
                    loading={user.updatePassword.loading}
                />
            )}
            {user.get.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
    login: state.login,
    loggedUser: state.login.user,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateUser: (...values) => dispatch(actions.updateUser(...values)),
    onResetUpdateUser: () => dispatch(actions.resetUpdateUser()),
    onUpdateUserPassword: (...values) => dispatch(actions.updatePasswordUser(...values)),
    onResetUpdateUserPassword: () => dispatch(actions.resetUpdatePasswordUser()),
    onRemoveUser: (...values) => dispatch(actions.removeUser(...values)),
    onReseteRemoveUser: () => dispatch(actions.resetRemoveUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
