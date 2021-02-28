import React from 'react';
import { Button, Spinner, Toast } from 'react-bootstrap';

const confirmedEmail = (props) => {
    const parentInStyle = {
        margin: '10% 25%',
        width: '50%',
        justifyContent: 'center',
        border: '3px solid silver',
        borderRadius: '0.2em',
    };

    return (
        <>
            {props.data.loading && <Spinner animation="border" variant="secondary" />}
            {props.data.confirmed && (
                <div style={{ ...parentInStyle }}>
                    <div style={{ margin: '10% 20%' }}>
                        <Toast>
                            <Toast.Header>
                                <strong className="mr-auto">Email Confirmado</strong>
                            </Toast.Header>
                            <Toast.Body>
                                Obrigado por se cadastrar no nosso sistema. Agora você pode acessá-lo!
                            </Toast.Body>
                        </Toast>
                        <div style={{ textAlign: 'right' }}>
                            <Button type="submit" onClick={() => props.onClick()} variant="primary">
                                Ir Para Login
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default confirmedEmail;
