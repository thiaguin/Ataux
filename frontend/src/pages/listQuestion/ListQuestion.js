import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SpinnerButton from '../../components/spinnerButton/SpinnerButton';
import Popup from '../../components/popup/Popup';
import * as actions from '../../store/actions';

const ListQuestion = (props) => {
    const { token, submission, question } = props;
    const { listId, questionId } = props.match.params;

    const dispatch = useDispatch();
    const onInitPage = useCallback((value) => dispatch(actions.getQuestionById(value)), [dispatch]);

    // const [classNameHover, setClassNameHover] = useState(false);
    const [popup, setPopup] = useState(null);

    const parentInStyle = {
        margin: '5%',
        width: '90%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '100%',
        margin: '0',
    };

    const submissions = submission.getAll.data;

    const history = useHistory();

    const onCheckSubmissionHandler = () => {
        props.onCheckSubmissions({
            token,
            listId,
            body: { questions: [Number(questionId)] },
        });
    };

    const goToUrlPageHandler = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const goBackHandler = () => {
        history.goBack();
    };

    useEffect(() => {
        if (questionId) {
            onInitPage(questionId);
            // eslint-disable-next-line no-console
            console.log({ questionId, listId });
            props.onGetAllSubmissions({ questionId, listId }, token);
        }
    }, [onInitPage, listId, questionId]);

    useEffect(() => {
        if (submission.check.success) {
            setPopup(null);
            props.onResetCheckSubmissions();
            props.onGetAllSubmissions({ questionId, listId }, token);
        }
    }, [submission.check.success]);

    useEffect(() => {
        if (submission.check.loading) {
            setPopup(<Popup type="info" message="Isso pode demorar um pouco." />);
        }
    }, [submission.check.loading]);

    useEffect(() => {
        if (submission.check.error) {
            setPopup(<Popup type="error" message={submission.check.error} onClose={props.onResetCheckSubmissions} />);
        }
    }, [submission.check.error]);

    return (
        <>
            {popup}
            {question.data && (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <div style={{ margin: '10px 30px' }}>
                            <div>
                                <h3
                                    style={{
                                        margin: '0',
                                        marginRight: '15px',
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        color: 'grey',
                                    }}
                                >
                                    Submissões
                                </h3>
                                {submission.check.loading ? (
                                    <SpinnerButton buttonVariant="secondary" style={{ width: '120px' }} />
                                ) : (
                                    <Button
                                        variant="secondary"
                                        style={{ width: '120px' }}
                                        type="button"
                                        onClick={onCheckSubmissionHandler}
                                    >
                                        Atualizar
                                    </Button>
                                )}
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={() => goToUrlPageHandler(question.data.url)}
                                    >
                                        Ir Para o Codeforces
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th key="key" style={{ width: '5%', textAlign: 'center' }}>
                                        {}
                                    </th>
                                    <th key="handle">Handle</th>
                                    <th key="question">Questão</th>
                                    <th key="result">Resultado</th>
                                    <th key="time" style={{ textAlign: 'center' }}>
                                        Tempo (ms)
                                    </th>
                                    <th key="memory" style={{ textAlign: 'center' }}>
                                        Mem (ms)
                                    </th>
                                    <th key="language" style={{ textAlign: 'center' }}>
                                        Linguagem
                                    </th>
                                    <th key="createdTime">Enviado em</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions &&
                                    submissions.data.map((el, index) => (
                                        <tr key={el.id} id={el.id}>
                                            <td key="key" style={{ textAlign: 'center' }}>
                                                {index + 1}
                                            </td>
                                            <td key="handle">{el.user.handle}</td>
                                            <td key="question">{el.question.title}</td>
                                            <td key="result" style={{ textAlign: 'center' }}>
                                                {el.status}
                                            </td>
                                            <td key="time" style={{ textAlign: 'center' }}>
                                                {el.time}
                                            </td>
                                            <td key="memory" style={{ textAlign: 'center' }}>
                                                {el.memory}
                                            </td>
                                            <td key="language" style={{ textAlign: 'center' }}>
                                                {el.language}
                                            </td>
                                            <td key="createdTime" style={{ textAlign: 'center' }}>
                                                {el.createdTime}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        <div style={{ textAlign: 'center' }}>
                            <Form.Group
                                style={{ width: '150px', display: 'inline-block' }}
                                controlId="formGridGoogleButton"
                            >
                                <Button
                                    style={{ minWidth: '150px' }}
                                    variant="secondary"
                                    type="button"
                                    onClick={goBackHandler}
                                >
                                    Voltar
                                </Button>
                            </Form.Group>
                            {/* <Form.Group
                                controlId="formGridSubmtiButton"
                                style={{ width: '150px', display: 'inline-block', marginLeft: '15px' }}
                            >
                                <Button style={{ minWidth: '150px' }} variant="primary" type="submit">
                                    Ver Usuários
                                </Button>
                            </Form.Group> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    question: state.question.get,
    submission: state.submission,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onGetAllSubmissions: (...values) => dispatch(actions.getAllSubmsssions(...values)),
    onCheckSubmissions: (value) => dispatch(actions.checkSubmission(value)),
    onResetCheckSubmissions: () => dispatch(actions.resetCheckSubmssions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListQuestion);
