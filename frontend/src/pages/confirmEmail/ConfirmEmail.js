import React, { useCallback, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ConfirmedEmail from '../../components/confirmeEmail/ConfirmedEmail';
import * as actions from '../../store/actions';

const ConfirmEmail = (props) => {
    const dispatch = useDispatch();
    const onInitPage = useCallback((value) => dispatch(actions.confirmEmail(value)), [dispatch]);

    const history = useHistory();
    const { code } = props.match.params;

    const goToLoginHandler = () => {
        history.push('/login');
    };

    useEffect(() => {
        if (props.data.error) {
            props.onResetConfirmEmail();
            history.push('/');
        }
    }, [props.data.error]);

    useEffect(() => {
        if (code) {
            onInitPage({ code });
        }
    }, [onInitPage, code]);

    return <>{code ? <ConfirmedEmail data={props.data} onClick={goToLoginHandler} /> : <div>here</div>}</>;
};

const mapStateToProps = (state) => ({
    data: state.confirmEmail,
});

const mapDispatchToProps = (dispatch) => ({
    onResetConfirmEmail: () => dispatch(actions.resetConfirmEmail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail);
