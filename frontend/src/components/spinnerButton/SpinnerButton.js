import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

const spinnerButton = (props) => (
    <>
        <Button style={props.style || {}} variant={props.buttonVariant || 'primary'} disabled>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
        </Button>
    </>
);

export default spinnerButton;
