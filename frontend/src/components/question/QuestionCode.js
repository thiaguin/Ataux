import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Code from '../code/Code';

const questionCode = (props) => {
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

    const [code, setCode] = useState(props.question.resolution || 'Digite aqui o código...');

    return (
        <>
            {props.question && (
                <div style={parentInStyle}>
                    <div style={childInStyle}>
                        <div style={{ margin: '10px 30px', marginBottom: '30px' }}>
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
                                    {props.question.title} - Solução
                                </h3>
                                <div style={{ display: 'inline-block', position: 'relative', float: 'right' }}>
                                    <Button variant="secondary" type="button" onClick={() => props.onSaveCode(code)}>
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '94%', margin: 'auto' }}>
                            <Code content={code} disabled={false} onChange={(value) => setCode(value)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default questionCode;
