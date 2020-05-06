import React from "react";

const header = (props) => {
return ( <h1 style={{
              fontWeight: "800",
              margin: "8px 0",
              fontSize: "32px"
        }}>{props.text}</h1> );
}

export default header;
