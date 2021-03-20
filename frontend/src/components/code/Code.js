import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'brace/theme/dracula';

const code = (props) => (
    <div style={{ marginBottom: '30px' }}>
        <AceEditor
            mode="javascript"
            theme="dracula"
            onChange={props.onChange}
            fontSize={16}
            value={props.content}
            readOnly={props.disabled}
            showPrintMargin={false}
            width="100%"
        />
    </div>
);

export default code;
