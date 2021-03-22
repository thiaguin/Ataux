import React from 'react';
import { Spinner } from 'react-bootstrap';

const spinner = () => {
    const parentInStyle = {
        margin: '25% 5%',
        width: '90%',
        justifyContent: 'center',
    };

    const childInStyle = {
        width: '100%',
        margin: '0',
        textAlign: 'center',
    };

    return (
        <>
            <div style={parentInStyle}>
                <div style={childInStyle}>
                    <Spinner style={{ width: '120px', height: '120px' }} animation="border" variant="secondary" />
                </div>
            </div>
        </>
    );
};

export default spinner;
