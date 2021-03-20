import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Form, Button, InputGroup, Image } from 'react-bootstrap';
import * as actions from '../../store/actions';
import SpinnerButton from '../spinnerButton/SpinnerButton';
import eyeSVG from '../../assets/eye.svg';
import eyeSlashSVG from '../../assets/eye-slash.svg';

const EditPasswordUser = (props) => {
    const schema = Yup.object().shape({
        currentPassword: Yup.string().min(6).required(),
        newPassword: Yup.string().min(6).required(),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
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
        margin: '8% 10% 3% 10%',
    };

    const [currentPasswordHide, setCurrentPasswordHide] = useState(true);
    const [currentPasswordHover, setCurrentPasswordHover] = useState(false);
    const [newPasswordHide, setNewPasswordHide] = useState(true);
    const [newPasswordHover, setNewPasswordHover] = useState(false);
    const [confirmPasswordHide, setConfirmPasswordHide] = useState(true);
    const [confirmPasswordHover, setConfirmPasswordHover] = useState(false);

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ newPassword: '', confirmPassword: '', currentPassword: '' }}
            >
                {({ handleSubmit, handleBlur, values, touched, isValid, handleChange, errors }) => (
                    <div style={parentInStyle}>
                        <div style={childInStyle}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Senha Atual</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            name="currentPassword"
                                            value={values.currentPassword}
                                            type={currentPasswordHide ? 'password' : 'text'}
                                            placeholder="Senha atual"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.currentPassword && errors.currentPassword}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text
                                                onMouseEnter={() => setCurrentPasswordHover(!currentPasswordHover)}
                                                onMouseLeave={() => setCurrentPasswordHover(!currentPasswordHover)}
                                                onClick={() => setCurrentPasswordHide(!currentPasswordHide)}
                                                style={currentPasswordHover ? { cursor: 'pointer' } : {}}
                                            >
                                                <Image src={currentPasswordHide ? eyeSVG : eyeSlashSVG} />
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>

                                    <Form.Control.Feedback type="invalid">
                                        Senha de tamanho minímo de 6 caracteres!
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Nova Senha</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            name="newPassword"
                                            value={values.newPassword}
                                            type={newPasswordHide ? 'password' : 'text'}
                                            placeholder="Nova senha"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.newPassword && errors.newPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Senha de tamanho minímo de 6 caracteres!
                                        </Form.Control.Feedback>
                                        <InputGroup.Append>
                                            <InputGroup.Text
                                                onMouseEnter={() => setNewPasswordHover(!newPasswordHover)}
                                                onMouseLeave={() => setNewPasswordHover(!newPasswordHover)}
                                                onClick={() => setNewPasswordHide(!newPasswordHide)}
                                                style={newPasswordHover ? { cursor: 'pointer' } : {}}
                                            >
                                                <Image src={newPasswordHide ? eyeSVG : eyeSlashSVG} />
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Label>Confirmar Senha</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            name="confirmPassword"
                                            value={values.confirmPassword}
                                            type={confirmPasswordHide ? 'password' : 'text'}
                                            placeholder="Confirme a senha"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                                touched.confirmPassword && values.newPassword !== values.confirmPassword
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Senhas não conferem.
                                        </Form.Control.Feedback>
                                        <InputGroup.Append>
                                            <InputGroup.Text
                                                onMouseEnter={() => setConfirmPasswordHover(!confirmPasswordHover)}
                                                onMouseLeave={() => setConfirmPasswordHover(!confirmPasswordHover)}
                                                onClick={() => setConfirmPasswordHide(!confirmPasswordHide)}
                                                style={confirmPasswordHover ? { cursor: 'pointer' } : {}}
                                            >
                                                <Image src={confirmPasswordHide ? eyeSVG : eyeSlashSVG} />
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group style={{ textAlign: 'right' }} controlId="formGridSubmtiButton">
                                    {props.loading ? (
                                        <SpinnerButton />
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => props.onSubmit(values)}
                                            disabled={
                                                values.confirmPassword !== values.newPassword ||
                                                !values.currentPassword ||
                                                !isValid
                                            }
                                        >
                                            Enviar
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

const mapStateToProps = (state) => ({
    updatePasswordRecovered: state.updateRecoveredPassword,
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateRecoveredPassword: (values) => dispatch(actions.updateRecoverPassword(values)),
    onResetUpdateRecoveredPassowrd: () => dispatch(actions.resetUpdateRecoverPassword()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPasswordUser);
