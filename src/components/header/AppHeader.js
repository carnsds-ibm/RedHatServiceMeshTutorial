import React from "react";

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
} from "carbon-components-react/es/components/UIShell";
const AppHeader = () => (
  <Header aria-label="Red Hat OpenShift Service Mesh Tutorial">
    <HeaderName href="/RedHatServiceMeshTutorial/" prefix="IBM">
      Red Hat OpenShift - Maistra Service Mesh Tutorial
    </HeaderName>
    <HeaderGlobalBar />
  </Header>
);
export default AppHeader;