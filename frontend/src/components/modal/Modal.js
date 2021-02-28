import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const modal = (props) => (
    <Modal.Dialog>
        <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <p>{props.body}</p>
        </Modal.Body>

        <Modal.Footer>
            <Button
                variant="secondary"
                style={{ width: '140px' }}
                onClick={props.secondaryButtonOnClick}
                disabled={!props.secondaryButton}
            >
                {props.secondaryButton}
            </Button>
            <Button variant="primary" style={{ width: '140px' }} onClick={props.primaryButtonOnClick}>
                {props.primaryButton}
            </Button>
        </Modal.Footer>
    </Modal.Dialog>
);

export default modal;
