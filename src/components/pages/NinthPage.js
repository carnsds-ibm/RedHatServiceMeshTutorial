import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";

const NinthPage = () => (
    <Content>
        <Header text="Questions or Comments?"/>
        <BodyText SM text="Thank you guys for checking out this ServiceMesh tutorial! If I can make any improvements or there are any questions, please reach out to my email below!"/>
        <UnorderedList>
            <ListItem>
                <BodyText text="Contact Email" />
                <BodyText SM text="Dillon.Carns@ibm.com" />
            </ListItem>
            <ListItem>
                <BodyText text="Quick Thanks" />
                <BodyText SM text={`Thank you to Mary Crivelli for helping with this tutorial and helping create the demo frontend. Thanks to Dennis Mila for helping create the demo application. Thank you to Jon Woodlief for some troubleshooting of ServiceMesh early on and also 
                for testing the tutorial, as well as Naod Deribe for his testing efforts as well. Thanks to Dave Mulley for the opportunity to explore this OpenShift feature and create this tutorial 
                under the guidance of GSE within IBM. A big Thanks to CPAT for the opportunity given here to learn about these cloud native solutions like Service Mesh. Finally, thank YOU for taking the time to run through the tutorial and I hope I helped at least a little bit learn more about Red Hat OpenShift - Maistra Service Mesh.`} />
            </ListItem>
        </UnorderedList>
    </Content>
);
export default NinthPage;
