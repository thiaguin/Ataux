import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from '../../store/actions';
import Popup from '../../components/popup/Popup';
import CreateTag from '../../components/tag/CreateTag';
import ShowTag from '../../components/tag/ShowTag';
import EditTag from '../../components/tag/EditTag';

const Tag = (props) => {
    const { tag } = props;
    const { mode, tagId } = props.match.params;

    const history = useHistory();
    const dispatch = useDispatch();

    const initTag = useCallback((param) => dispatch(actions.getTagById(param)), [dispatch]);

    const [popup, setPopup] = useState(null);

    const createHandler = (values) => {
        props.onCreateTag(values, props.token);
    };

    const goToEditPageHandler = (tagIdToEdit) => {
        history.push(`/tag/edit/${tagIdToEdit}`);
    };

    const goBackHandler = () => {
        history.goBack();
    };

    const goToListPageHandler = () => {
        history.push('/tag');
    };

    const removeTagHandler = (id) => {
        props.onRemoveTag(id, props.token);
    };

    const editHandler = (values) => {
        props.onUpdateTag({
            id: tagId,
            token: props.token,
            name: values.name,
        });
    };

    useEffect(() => {
        if (['edit', 'show'].includes(mode) && tagId) {
            initTag(tagId);
        } else if (mode !== 'create') {
            history.push('/tag');
        }
    }, [initTag, tagId, mode]);

    useEffect(() => {
        if (tag.create.error) {
            setPopup(<Popup type="error" message={tag.create.error} onClose={props.onResetCreateTag} />);
        }
    }, [tag.create.error]);

    useEffect(() => {
        if (tag.create.tagId) {
            history.push(`/tag/show/${tag.create.tagId}`);
        }
    }, [tag.create.tagId]);

    useEffect(() => {
        if (tag.update.success) {
            props.onResetUpdateTag();
            history.push(`/tag/show/${tag.get.tag.id}`);
        }
    }, [tag.update.success]);

    useEffect(() => {
        if (tag.remove.success) {
            props.onReseteRemoveTag();
            history.push('/tag');
        }
    }, [tag.remove.success]);

    useEffect(() => {
        if (tag.remove.error) {
            setPopup(<Popup type="error" message={tag.remove.error} onClose={props.onReseteRemoveTag} />);
        }
    }, [tag.remove.error]);

    return (
        <>
            {popup}
            {mode === 'create' && <CreateTag submitHandler={createHandler} loading={tag.create.loading} />}
            {mode === 'show' && tag.get.tag && (
                <ShowTag tag={tag.get.tag} goBack={goToListPageHandler} gotToEditPage={goToEditPageHandler} />
            )}
            {mode === 'edit' && tag.get.tag && (
                <EditTag tag={tag.get.tag} goBack={goBackHandler} submit={editHandler} onRemove={removeTagHandler} />
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    tag: state.tag,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateTag: (...values) => dispatch(actions.createTag(...values)),
    onResetCreateTag: () => dispatch(actions.resetCreateTag()),
    onUpdateTag: (...values) => dispatch(actions.updateTag(...values)),
    onResetUpdateTag: () => dispatch(actions.resetUpdateTag()),
    onRemoveTag: (...values) => dispatch(actions.removeTag(...values)),
    onReseteRemoveTag: () => dispatch(actions.resetRemoveTag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
