/* eslint-disable no-console */
import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const menu = (props) => (
    <DropdownButton id="dropdown-basic-button" variant="secondary" title="Configurações">
        <Dropdown.Item href={`/user/show/${props.loggedUser.userId}`}>Ver Perfil</Dropdown.Item>
        <Dropdown.Item onClick={props.onLogoutClick}>Logout</Dropdown.Item>
    </DropdownButton>
);

export default menu;
