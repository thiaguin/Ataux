import React, { useState } from 'react';
import { Form, Button, Col, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SpinnerButton from '../spinnerButton/SpinnerButton';
import trashSVG from '../../assets/trash.svg';
import whiteTrashSVG from '../../assets/trash-white.svg';

const creatList = (props) => {
    const today = new Date();

    today.setUTCHours(0);
    today.setMinutes(0);

    const schema = Yup.object().shape({
        title: Yup.string().required(),
        expirationDate: Yup.date().min(today).required(),
        expirationTime: Yup.string().required(),
        penalty: Yup.number().positive().required(),
        startDate: Yup.date().min(today).required(),
        startTime: Yup.string().required(),
        questionURL: Yup.string(),
    });

    const parentInStyle = {
        margin: '7% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '7% 15% 5% 10%',
    };

    const [trashHover, setTrashHover] = useState(false);

    return (
        <Formik
            validationSchema={schema}
            initialValues={{
                title: '',
                expirationTime: '23:59',
                expirationDate: '',
                questions: [],
                questionURL: '',
                startTime: '00:00',
                startDate: '',
                penalty: 1,
            }}
        >
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid }) => (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId="formURL" onSubmit={props.submitHandler}>
                                <Form.Label>Nome da Lista</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={values.title}
                                    type="text"
                                    placeholder="Nome da nova lista"
                                    onChange={handleChange}
                                    isInvalid={touched.title && errors.title}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formDateURL" onSubmit={props.submitHandler}>
                                    <Form.Label>Data de Início</Form.Label>
                                    <Form.Control
                                        name="startDate"
                                        value={values.startDate}
                                        type="date"
                                        placeholder="Data de início da nova lista"
                                        onChange={handleChange}
                                        isInvalid={touched.startDate && errors.startDate}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formTimeURL" onSubmit={props.submitHandler}>
                                    <Form.Label>Horário de Início</Form.Label>
                                    <Form.Control
                                        name="startTime"
                                        value={values.startTime}
                                        type="time"
                                        placeholder="Horário limite da nova lista"
                                        onChange={handleChange}
                                        isInvalid={touched.startTime && errors.startTime}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formDateURL" onSubmit={props.submitHandler}>
                                    <Form.Label>Data Limite</Form.Label>
                                    <Form.Control
                                        name="expirationDate"
                                        value={values.expirationDate}
                                        type="date"
                                        placeholder="Data limite da nova lista"
                                        onChange={handleChange}
                                        isInvalid={touched.expirationDate && errors.expirationDate}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formTimeURL" onSubmit={props.submitHandler}>
                                    <Form.Label>Horário Limite</Form.Label>
                                    <Form.Control
                                        name="expirationTime"
                                        value={values.expirationTime}
                                        type="time"
                                        placeholder="Horário limite da nova lista"
                                        onChange={handleChange}
                                        isInvalid={touched.expirationTime && errors.expirationTime}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Group controlId="formURL" onSubmit={props.submitHandler}>
                                <Form.Label>Penalização</Form.Label>
                                <Form.Control
                                    name="penalty"
                                    value={values.penalty}
                                    type="number"
                                    onChange={handleChange}
                                    isInvalid={touched.penalty && errors.penalty}
                                    onBlur={handleBlur}
                                    defaultValue={1}
                                />
                            </Form.Group>
                            <Form.Group controlId="formQuestions" readOnly>
                                <div style={{ marginBottom: '10px' }}>
                                    <Form.Label>Questões</Form.Label>
                                    <div
                                        onMouseEnter={() => setTrashHover(!trashHover)}
                                        onMouseLeave={() => setTrashHover(!trashHover)}
                                        style={{ display: 'inline-block', position: 'relative', float: 'right' }}
                                    >
                                        <Button
                                            style={{ padding: '4px 7px' }}
                                            variant="outline-danger"
                                            type="button"
                                            onClick={() => props.removeQuestion(values.questions)}
                                        >
                                            <Image
                                                style={{ fill: 'green', position: 'relative', padding: '0' }}
                                                src={trashHover ? whiteTrashSVG : trashSVG}
                                            />
                                        </Button>
                                    </div>
                                </div>
                                <Form.Control
                                    name="questions"
                                    style={{ height: '150px' }}
                                    onChange={handleChange}
                                    as="select"
                                    multiple
                                >
                                    {props.listQuestions.map((value) => (
                                        <option key={value.title} value={value.id}>
                                            {value.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <div style={{ textAlign: 'justify', marginBottom: '20px' }}>
                                <Form.Group style={{ width: '68%', display: 'inline-block' }} controlId="formTitle">
                                    <Form.Label>Adicionar Questão</Form.Label>
                                    <Form.Control
                                        name="questionURL"
                                        value={props.newQuestionURL}
                                        type="text"
                                        placeholder="Link da questão no codeforces"
                                        onChange={(value) => props.onNewQuestionURLChange(value)}
                                    />
                                </Form.Group>{' '}
                                {props.newQuestionLoading ? (
                                    <SpinnerButton
                                        buttonVariant="outline-info"
                                        style={{ minWidth: '20%', height: '10%' }}
                                    />
                                ) : (
                                    <Button
                                        style={{ minWidth: '20%', height: '10%' }}
                                        variant="outline-info"
                                        type="submit"
                                        disabled={!props.newQuestionURL}
                                        onClick={() => props.onAddQuestion(props.newQuestionURL)}
                                    >
                                        Adicionar Questão
                                    </Button>
                                )}
                            </div>
                            <Form.Group
                                style={{ textAlign: 'right', marginTop: '25px', marginBottom: '0' }}
                                controlId="formGridSubmtiButton"
                            >
                                <Button
                                    style={{ width: '100px', marginRight: '7px' }}
                                    variant="secondary"
                                    type="button"
                                    onClick={props.goBack}
                                >
                                    Voltar
                                </Button>
                                {props.loading ? (
                                    <SpinnerButton style={{ width: '100px' }} />
                                ) : (
                                    <Button
                                        style={{ width: '100px' }}
                                        variant="primary"
                                        type="submit"
                                        disabled={!values.title || !values.expirationDate || !isValid}
                                        onClick={() => props.onSubmit({ ...values, questions: props.listQuestions })}
                                    >
                                        Salvar
                                    </Button>
                                )}
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default creatList;
