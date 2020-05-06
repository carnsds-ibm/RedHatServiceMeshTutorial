import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import CodeSnip from '../util/CustomCodeSnip';
import Image from '../util/Image';
import BodyText from '../text/BodyText';
import { UnorderedList, ListItem } from "carbon-components-react";

// == ASSETS ==
import IMG from '../../assets/pg2-1.png';
import IMG2 from '../../assets/pg2-2.png';
import IMG3 from '../../assets/pg2-3.png';
import IMG4 from '../../assets/pg2-4.png';
import IMG5 from '../../assets/pg2-5.png';
import IMG6 from '../../assets/pg2-6.png';

const SecondPage = () => {
  return (
    <Content>
    <Header text="Setup"/>
    <UnorderedList>
        <ListItem>
          <BodyText B text='First, ensure that you are logged in to your cluster of choice.'/>
        </ListItem>
        <ListItem>
          <BodyText B text='We must then create a couple projects on our cluster.'/>
        </ListItem>
        <ListItem>
          <BodyText text="Let's export our initials just so we ensure unique names throughout our projects. Run the following in your terminal or add an environment variable another way." />
          <CodeSnip text='export INITIALS="<Enter your initials>"'/>
          <br/>
          <BodyText text="Echo your INITIALS to ensure it's working."/>
          <CodeSnip text='echo $INITIALS'/>
          <BodyText text="Then please export the project names to make some of the future commands easier." />
          <CodeSnip M text='
export MESH_PROJ="$INITIALS-istio-system"
export APP_PROJ="$INITIALS-application"
'/>
          <br/>
        </ListItem>
        <ListItem>
          <BodyText text="Now let's create a project that our mesh will run in (could also accomplish on the cluster)."/>
          <CodeSnip text='oc new-project $MESH_PROJ'/>
        </ListItem>
        <ListItem>
          <BodyText text="Then let's create a project that our application will run in (could also accomplish on the cluster)."/>
          <CodeSnip text='oc new-project $APP_PROJ'/>
        </ListItem>
        <ListItem>
          <BodyText text={`Navigate to your ${'<initials>'}-istio-system project on the cluster.`}/>
          <Image path={IMG} text='Switching to istio-system proj.' />
        </ListItem>
        <ListItem>
          <BodyText text={`Switch to the Administrator role and navigate to Installed Operators and click on the "Red Hat OpenShift Service Mesh" or "Maistra Service Mesh" (same thing) operator link.`}/>
          <Image path={IMG2} text='Selecting correct operator' />
        </ListItem>
        <ListItem>
          <BodyText text={`Once on the operator page, click the create instance link on the "Istio Service Mesh Control Plane" card. Either Use the defaults or feel free to change the name, then click create when ready.`}/>
          <Image path={IMG3} text='Creation link control plane' />
        </ListItem>
        <ListItem>
          <BodyText text={`Either Use the defaults or feel free to change the name, then click create when ready.`}/>
          <Image path={IMG4} text='Creating the control plane' />
        </ListItem>
        <ListItem>
          <BodyText text={`Aftwerwards, navigate back to the overview and click the create instance link on the "Istio Service Mesh Member Roll".`}/>
          <Image path={IMG5} text='Creation link service mesh member roll' />
        </ListItem>
        <ListItem>
          <BodyText text={`Add your application namespace to the members array in the yaml (<initials>-application), then click create when ready.`}/>
          <Image path={IMG6} text='Adding application project to service mesh member roll' />
        </ListItem>
        <ListItem>
          <BodyText text='Summary' />
          <BodyText SM text={`What we've done here is created two new projects. The mesh project and the application project. The mesh project is in charge of controlling the Service Mesh system that watches over
            our application project as we specified in the service mesh member roll. The Service Mesh Control Plane on the other hand, actually tells the operator to spawn a new service mesh in the project.
            That is all that is required to leverage the mesh services for our application, let's move on to configuration!`} />
        </ListItem>
    </UnorderedList>
    </Content>
  );
};
export default SecondPage;
