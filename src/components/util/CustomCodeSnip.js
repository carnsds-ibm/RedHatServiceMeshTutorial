import React from 'react';
import copy from 'copy-to-clipboard';
import { CodeSnippet } from 'carbon-components-react';


const codeSnip = (props) => (
    <CodeSnippet 
        type={props.M ? 'multi' : props.I ? 'inline' : 'single'} 
        onClick={() => copy(props.text)}
        style={{ width: '40vw' }}
        >
        {props.text}
    </CodeSnippet>
);

export default codeSnip;
