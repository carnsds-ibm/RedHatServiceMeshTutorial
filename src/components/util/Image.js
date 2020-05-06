import React from 'react';
const image = props => {
    return (
        <img style={{ width: '40vw', padding: '8px' }} src={props.path} alt={props.text} />
    );
}


export default image;
