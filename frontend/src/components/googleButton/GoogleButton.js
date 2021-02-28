import React from 'react';
import { Button, Image } from 'react-bootstrap';
import googleImg from '../../assets/google-image-button.png';

const googleButton = (props) => {
    const googleButtonStyle = { ...props.style, width: '100%', backgroundColor: 'gray', alignItems: 'left' };
    const googleImgStyle = { width: '24px', borderRadius: '0.2em', marginRight: '15px' };

    return (
        <>
            <Button onClick={props.onClick} style={googleButtonStyle} variant="primary">
                <Image src={googleImg} style={googleImgStyle} />
                {props.name}
            </Button>
        </>
    );
};

export default googleButton;
