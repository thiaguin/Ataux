import React, { useCallback, useEffect, useState } from 'react';
import { Button, Nav, Pagination, Table } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SpinnerButton from '../../components/spinnerButton/SpinnerButton';
import Popup from '../../components/popup/Popup';
import * as actions from '../../store/actions';
import Spinner from '../../components/spinner/spinner';
import { showTime } from '../../utils/timeUtils';

const ListQuestion = (props) => {
    const { token, submission, question } = props;
    const { listId, questionId } = props.match.params;

    const dispatch = useDispatch();
    const onInitPage = useCallback((...values) => dispatch(actions.getQuestionById(...values)), [dispatch]);

    const [page, setPage] = useState(0);
    const [popup, setPopup] = useState(null);
    const [questionNameHover, setQuestionNameHover] = useState(null);

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
    const submissionscount = submissions && submissions.count ? submissions.count : 0;
    const submissionsPerPage = 30;
    const initialPage = 0;
    const lastPage = submissionscount > 0 ? Math.floor((submissionscount - 1) / submissionsPerPage) : 0;

    const history = useHistory();

    const onCheckMemberSubmissionHandler = () => {
        props.onCheckSubmissions({
            token,
            listId,
            body: { questions: [Number(questionId)] },
        });
    };

    const onCheckPriviligiesSubmissionHandler = () => {
        const body = { questions: [Number(questionId)] };
        props.onCheckAllUsersSubmissionHandler(listId, token, body);
    };

    const goToUrlPageHandler = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const goBackHandler = () => {
        history.goBack();
    };

    const onCheckSubmissionHandler =
        props.loggedUser.role === 'MEMBER' ? onCheckMemberSubmissionHandler : onCheckPriviligiesSubmissionHandler;

    const clickQuestionHandler = (el) => {
        history.push(`/question/show/${el.questionId}`);
    };

    useEffect(() => {
        if (questionId) {
            onInitPage(questionId, token);
            props.onGetAllSubmissions({ questionId, listId }, token);
        }
    }, [onInitPage, listId, questionId]);

    useEffect(() => {
        if (questionId) {
            props.onGetAllSubmissions({ questionId, listId, page }, token);
        }
    }, [page, listId, questionId]);

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
                                        Sincronizar
                                    </Button>
                                )}
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    <Button
                                        style={{ minWidth: '150px', marginRight: '7px' }}
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={goBackHandler}
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        variant="secondary"
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
                                    <th key="penalty" style={{ textAlign: 'center' }}>
                                        Atraso (dias)
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
                                            <td key="key" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                {submissionsPerPage * page + index + 1}
                                            </td>
                                            <td key="handle" style={{ verticalAlign: 'middle' }}>
                                                {el.user.handle}
                                            </td>
                                            <td
                                                key="question"
                                                onClick={() => clickQuestionHandler(el)}
                                                onMouseEnter={() => setQuestionNameHover(el.id)}
                                                onMouseLeave={() => setQuestionNameHover(null)}
                                                style={
                                                    questionNameHover === el.id
                                                        ? {
                                                              textDecoration: 'underline',
                                                              cursor: 'pointer',
                                                              verticalAlign: 'middle',
                                                          }
                                                        : { verticalAlign: 'middle' }
                                                }
                                            >
                                                {el.question.title}
                                            </td>
                                            <td key="result" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                {el.status}
                                            </td>
                                            <td key="time" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                {el.time}
                                            </td>
                                            <td key="memory" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                {el.memory}
                                            </td>
                                            <td key="penalty" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                {el.penalty}
                                            </td>
                                            <td key="language" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                <Nav.Link href={`/submission/show/${el.id}`} eventKey="link-2">
                                                    {el.language}
                                                </Nav.Link>
                                            </td>
                                            <td
                                                key="createdTime"
                                                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                                            >
                                                {showTime(el.createdTime)}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        {submissions && submissions.count === 0 && (
                            <p style={{ textAlign: 'center' }}>Não foi encontrado nenhuma submissão</p>
                        )}
                        <Pagination
                            style={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                paginationFirstStyle: {
                                    marginLeft: '5px',
                                    color: 'red',
                                },
                            }}
                        >
                            <Pagination.First onClick={() => setPage(0)} disabled={page === initialPage} />
                            <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === initialPage} />
                            <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === lastPage} />
                            <Pagination.Last onClick={() => setPage(lastPage)} disabled={page === lastPage} />
                        </Pagination>
                    </div>
                </div>
            )}
            {question.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    question: state.question.get,
    submission: state.submission,
    token: state.login.token,
    loggedUser: state.login.user,
});

const mapDispatchToProps = (dispatch) => ({
    onGetAllSubmissions: (...values) => dispatch(actions.getAllSubmissions(...values)),
    onCheckSubmissions: (value) => dispatch(actions.checkSubmission(value)),
    onCheckAllUsersSubmissionHandler: (...values) => dispatch(actions.checkAllUsersSubmissions(...values)),
    onResetCheckSubmissions: () => dispatch(actions.resetCheckSubmssions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListQuestion);
