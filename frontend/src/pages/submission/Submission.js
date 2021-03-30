import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Popup from '../../components/popup/Popup';
import * as actions from '../../store/actions';
import Code from '../../components/code/Code';
import Spinner from '../../components/spinner/spinner';
import { showTime } from '../../utils/timeUtils';

const Submission = (props) => {
    const { token, submission } = props;
    const { submissionId } = props.match.params;

    const history = useHistory();

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
        justifyContent: 'center',
    };

    const clickQuestionHandler = (el) => {
        history.push(`/question/show/${el.questionId}`);
    };

    useEffect(() => {
        if (submissionId) {
            props.onGetSubmission(submissionId, token);
        }
    }, [props.onGetSubmission, submissionId, token]);

    useEffect(() => {
        if (submission.get.error) {
            setPopup(<Popup type="error" message={submission.get.error} onClose={props.onResetCheckSubmissions} />);
        }
    }, [submission.get.error]);

    return (
        <>
            {popup}
            {submission.get.data && (
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
                        <div style={{ width: '92%', margin: 'auto' }}>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
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
                                    <tr key={submission.get.data.id} id={submission.get.data.id}>
                                        <td key="handle" style={{ verticalAlign: 'middle' }}>
                                            {submission.get.data.user.handle}
                                        </td>
                                        <td
                                            key="question"
                                            onClick={() => clickQuestionHandler(submission.get.data)}
                                            onMouseEnter={() => setQuestionNameHover(submission.get.data.id)}
                                            onMouseLeave={() => setQuestionNameHover(null)}
                                            style={
                                                questionNameHover === submission.get.data.id
                                                    ? {
                                                          textDecoration: 'underline',
                                                          cursor: 'pointer',
                                                          verticalAlign: 'middle',
                                                      }
                                                    : { verticalAlign: 'middle' }
                                            }
                                        >
                                            {submission.get.data.question.title}
                                        </td>
                                        <td key="result" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {submission.get.data.status}
                                        </td>
                                        <td key="time" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {submission.get.data.time}
                                        </td>
                                        <td key="memory" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {submission.get.data.memory}
                                        </td>
                                        <td key="penalty" style={{ textAlign: 'center' }}>
                                            {submission.get.data.penalty}
                                        </td>
                                        <td key="language" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {submission.get.data.language}
                                        </td>
                                        <td key="createdTime" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {showTime(submission.get.data.createdTime)}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Code content={submission.get.data.code} disabled />
                        </div>
                    </div>
                </div>
            )}
            {submission.get.loading && <Spinner />}
        </>
    );
};

const mapStateToProps = (state) => ({
    submission: state.submission,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => ({
    onGetSubmission: (...values) => dispatch(actions.getSubmissionById(...values)),
    onCheckSubmissions: (value) => dispatch(actions.checkSubmission(value)),
    onResetCheckSubmissions: () => dispatch(actions.resetCheckSubmssions()),
    onResetGetSubmisson: () => dispatch(actions.resetGetSubmissionById()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
