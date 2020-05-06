import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";
import CodeSnip from "../util/CustomCodeSnip";

const NinthPage = () => (
    <Content>
        <Header text="Cleanup & Contact"/>
        <UnorderedList>
            <ListItem>
                <BodyText text="Cleanup" />
                <BodyText SM text="Make sure MESH_PROJ and APP_PROJ are still set one last time, then run the following command to delete your projects and relieve your clusters a little bit." />
                <CodeSnip text="oc delete project $MESH_PROJ $APP_PROJ" />
            </ListItem>
            <ListItem>
                <BodyText text="Contact Email" />
                <BodyText SM text="If I can make any improvements or there are any questions, please reach out to my email below!"/>
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
