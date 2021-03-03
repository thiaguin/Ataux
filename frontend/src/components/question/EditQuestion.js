import React, { useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import levelTypes from '../../enums/levelTypes';
import trashSVG from '../../assets/trash.svg';
import whiteTrashSVG from '../../assets/trash-white.svg';

const editQuestion = (props) => {
    const [trashHover, setTrashHover] = useState(false);

    const parentInStyle = {
        margin: '5% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid silver',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '7% 15% 5% 10%',
    };

    return (
        <Formik initialValues={{ level: props.question.level, newTagId: '', tags: [] }}>
            {({ handleSubmit, handleChange, values, isValid }) => (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <Form noValidate onSubmit={handleSubmit}>
                            <div style={{ textAlign: 'justify' }}>
                                <Form.Group style={{ width: '83%', display: 'inline-block' }} controlId="formTitle">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control
                                        name="title"
                                        value={props.question.title}
                                        readOnly
                                        disabled
                                        type="text"
                                    />
                                </Form.Group>{' '}
                                <Button
                                    style={{ minWidth: '15%', height: '10%' }}
                                    variant="outline-info"
                                    type="button"
                                    onClick={() => props.goToUrlPage(props.question.url)}
                                >
                                    Ir
                                </Button>
                            </div>
                            <Form.Group controlId="formLevel">
                                <Form.Label>Dificuldade</Form.Label>
                                <Form.Control
                                    name="level"
                                    onChange={handleChange}
                                    value={values.level}
                                    readOnly
                                    as="select"
                                >
                                    {Object.keys(levelTypes).map((level) => (
                                        <option key={level} value={level}>
                                            {levelTypes[level]}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>{' '}
                            <Form.Group controlId="formTags" readOnly>
                                <div style={{ marginBottom: '10px' }}>
                                    <Form.Label>Tags</Form.Label>
                                    <div
                                        onMouseEnter={() => setTrashHover(!trashHover)}
                                        onMouseLeave={() => setTrashHover(!trashHover)}
                                        style={{ display: 'inline-block', position: 'relative', float: 'right' }}
                                    >
                                        <Button
                                            style={{ padding: '4px 7px' }}
                                            variant="outline-danger"
                                            type="button"
                                            onClick={() => props.removeTag(values.tags)}
                                        >
                                            <Image
                                                style={{ fill: 'green', position: 'relative', padding: '0' }}
                                                src={trashHover ? whiteTrashSVG : trashSVG}
                                            />
                                        </Button>
                                    </div>
                                </div>
                                <Form.Control
                                    name="tags"
                                    style={{ height: '150px' }}
                                    onChange={handleChange}
                                    as="select"
                                    multiple
                                >
                                    {props.questionTags.map((value) => (
                                        <option key={value.name} value={value.id}>
                                            {value.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <div style={{ textAlign: 'justify', marginBottom: '20px' }}>
                                <Form.Group style={{ width: '74%', display: 'inline-block' }} controlId="formTitle">
                                    <Form.Label>Adicionar Tag</Form.Label>
                                    <Form.Control
                                        name="newTagId"
                                        onChange={handleChange}
                                        readOnly
                                        type="text"
                                        as="select"
                                        defaultValue=""
                                    >
                                        <option style={{ display: 'none' }}> </option>
                                        {props.tags.map((tag) => (
                                            <option key={tag.id} value={tag.id}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>{' '}
                                <Button
                                    style={{ minWidth: '20%', height: '10%' }}
                                    variant="outline-info"
                                    type="button"
                                    disabled={!values.newTagId}
                                    onClick={() => props.addQuestionTag(values.newTagId)}
                                >
                                    Adicionar Tag
                                </Button>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Form.Group
                                    style={{ width: '150px', display: 'inline-block' }}
                                    controlId="formGridGoogleButton"
                                >
                                    <Button
                                        style={{ minWidth: '150px' }}
                                        variant="secondary"
                                        type="button"
                                        onClick={props.goBack}
                                    >
                                        Voltar
                                    </Button>
                                </Form.Group>
                                <Form.Group
                                    controlId="formGridSubmtiButton"
                                    style={{ width: '150px', display: 'inline-block', marginLeft: '15px' }}
                                >
                                    <Button
                                        style={{ minWidth: '150px' }}
                                        variant="primary"
                                        type="submit"
                                        disabled={!isValid}
                                        onClick={() => props.submit(values)}
                                    >
                                        Salvar
                                    </Button>
                                </Form.Group>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default editQuestion;
