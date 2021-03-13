import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
// import Popup from '../../components/popup/Popup';
import ShowUser from '../../components/user/ShowUser';
import EditUser from '../../components/user/EditUser';
import EditPasswordUser from '../../components/user/EditPasswordUser';
import Popup from '../../components/popup/Popup';

const User = (props) => {
    const { user, login } = props;
    const { mode, userId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initUser = useCallback((param) => dispatch(actions.getUserById(param)), [dispatch]);

    const [popup, setPopup] = useState(null);

    const goToEditPageHandler = (userIdToEdit) => {
        history.push(`/user/edit/${userIdToEdit}`);
    };

    const goBackHandler = () => {
        history.goBack();
    };

    const editHandler = (values) => {
        props.onUpdateUser({ ...values, userId });
    };

    const editPasswordHandler = ({ currentPassword, newPassword }) => {
        props.onUpdateUserPassword({ currentPassword, newPassword, userId });
    };

    const goToEditPasswordPageHandler = () => {
        history.push(`/user/updatePassword/${userId}`);
    };

    useEffect(() => {
        if (['edit', 'show', 'updatePassword'].includes(mode) && userId) {
            initUser(userId);
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
            setPopup(<Popup type="error" message={user.update.error} onClose={props.onResetCreateTag} />);
        }
    }, [user.update.error]);

    return (
        <>
            {popup}
            {mode === 'show' && user.get.data && (
                <ShowUser
                    user={user.get.data}
                    goBack={goBackHandler}
                    onSubmit={goToEditPageHandler}
                    submitButton="Editar"
                />
            )}
            {mode === 'edit' && user.get.data && (
                <EditUser
                    user={user.get.data}
                    onClickEditPassword={goToEditPasswordPageHandler}
                    onSubmit={editHandler}
                    currUser={login.user}
                />
            )}
            {mode === 'updatePassword' && user.get.data && (
                <EditPasswordUser
                    user={user.get.data}
                    onSubmit={editPasswordHandler}
                    loading={user.updatePassword.loading}
                />
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
    login: state.login,
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateUser: (value) => dispatch(actions.updateUser(value)),
    onResetUpdateUser: () => dispatch(actions.resetUpdateUser()),
    onUpdateUserPassword: (value) => dispatch(actions.updatePasswordUser(value)),
    onResetUpdateUserPassword: () => dispatch(actions.resetUpdatePasswordUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
