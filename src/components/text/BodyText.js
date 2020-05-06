import React from 'react';

const bodyText = props => (
    <p style={
        {
            fontSize: props.SM ? '15px' : '20px',
            paddingBottom: '8px',
            width: '40vw'
        }
    }>
    {props.B ? <strong>{props.text}</strong> : props.text}
    </p>
)

export default bodyText;