import React from "react";

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
} from "carbon-components-react/es/components/UIShell";
const AppHeader = () => (
  <Header aria-label="Red Hat Service Mesh Tutorial">
    <HeaderName href="/" prefix="IBM CPAT">
      Red Hat Service Mesh Tutorial
    </HeaderName>
    <HeaderGlobalBar />
  </Header>
);
export default AppHeader;