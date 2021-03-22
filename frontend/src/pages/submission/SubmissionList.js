import React, { useCallback, useEffect, useState } from 'react';
import { Nav, Pagination, Table } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Popup from '../../components/popup/Popup';
import Spinner from '../../components/spinner/spinner';
import * as actions from '../../store/actions';

const SubmissionList = (props) => {
    const { token, submission } = props;

    const dispatch = useDispatch();
    const onInitPage = useCallback((...values) => dispatch(actions.getAllSubmissions(...values)), [dispatch]);

    const history = useHistory();

    const [popup, setPopup] = useState(null);
    const [page, setPage] = useState(0);
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

    const clickQuestionHandler = (el) => {
        history.push(`/question/show/${el.questionId}`);
    };

    useEffect(() => {
        onInitPage({ page }, token);
    }, [onInitPage, page, token]);

    useEffect(() => {
        if (submission.getAll.error) {
            setPopup(<Popup type="error" message={submission.getAll.error} onClose={props.onResetCheckSubmissions} />);
        }
    }, [submission.getAll.error]);

    return (
        <>
            {popup}
            {submissions && submissions.data && (
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
                                {submissions.data.map((el, index) => (
                                    <tr key={el.id} id={el.id}>
                                        <td key="key" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {index + 1}
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
                                        <td key="language" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <Nav.Link href={`/submission/show/${el.id}`} eventKey="link-2">
                                                {el.language}
                                            </Nav.Link>
                                        </td>
                                        <td key="createdTime" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {`${new Date(el.createdTime).toLocaleDateString('pt-BR')} - ${new Date(
                                                el.createdTime,
                                            ).toLocaleTimeString('pt-BR')}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {submissions.count === 0 && (
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
            {submission.getAll.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    submission: state.submission,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onGetAllSubmissions: (...values) => dispatch(actions.getAllSubmissions(...values)),
    onResetCheckSubmissions: () => dispatch(actions.resetGetSubmissionById()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionList);
