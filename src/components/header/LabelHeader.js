import React from "react";

const header = (props) => {
return ( <h4 style={{
              fontWeight: "500",
              marginTop: "14px",
              marginBottom: "14px",
              fontSize: "24px"
        }}>{props.text}</h4> );
}

export default header;
