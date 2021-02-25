import React from 'react';
import { Button, Image } from 'react-bootstrap';
import googleImg from '../../assets/google-image-button.png';

const googleButton = (props) => {
    const googleButtonStyle = { width: '100%', backgroundColor: 'gray', alignItems: 'left' };
    const googleImgStyle = { width: '24px', borderRadius: '0.2em', marginRight: '15px' };

    return (
        <>
            <Button onClick={props.onClick} style={googleButtonStyle} variant="primary" type="submit">
                <Image src={googleImg} style={googleImgStyle} />
                Login With Google
            </Button>
        </>
    );
};

export default googleButton;
