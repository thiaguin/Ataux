/* eslint-disable no-console */
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const popup = (props) => {
    const toastType = props.type ? toast[props.type] : toast;
    toastType(props.message, { toastId: props.message, onClose: props.onClose });

    return <ToastContainer />;
};

export default popup;
