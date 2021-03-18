import React from 'react';
import { Popover } from 'react-bootstrap';

const popover = (props) => {
    const tags = props.tags || [];
    const tagsNames = tags.map((value) => (
        <div key={value.tag[0].name}>
            {value.tag[0].name}
            <br />
        </div>
    ));

    return (
        <>
            <Popover style={{ backgroundColor: '#f5eee0' }} id="key">
                <Popover.Content>{tagsNames} </Popover.Content>
            </Popover>
        </>
    );
};

export default popover;
