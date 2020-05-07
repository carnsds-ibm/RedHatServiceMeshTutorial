import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";
import CodeSnip from "../util/CustomCodeSnip";
import Image from '../util/Image';

// == ASSETTS ==
import IMG1 from '../../assets/pg8-1.png';

const EighthPage = () => (
  <Content>
      <Header text="Egress"/>
      <UnorderedList>
        <ListItem>
          <BodyText text="Purpose" />
          <BodyText SM text={`This section will try to show you how to setup egress properly. Such that, if your application required external resources like a database or a third-party API, 
          you could restrict your mesh to only be able to communicate with those. So, this section will be sort of short, we're just gonna make two resources to show how to add and configure an external resource. 
          We will be making use of a ServiceEntry and a VirtualService to show how to set it up and configure a timeout on said resource.`} />
          <BodyText SM B text={`Please ensure you have your APP_PROJ environment variable set and are logged into the oc CLI.`} />
          <BodyText SM text="Then please switch to your <initials>-application project with the CLI." />
          <CodeSnip text="oc project $APP_PROJ" />
        </ListItem>
        <ListItem>
          <BodyText text="Making the ServiceEntry" />
          <BodyText SM text={`Copy and run the following command.`} />
          <CodeSnip M text={
`cat << EOF > service_entry.yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: redhat
spec:
  hosts:
  - www.redhat.com
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  resolution: DNS
  location: MESH_EXTERNAL
EOF
oc apply -f service_entry.yaml`} />
        <BodyText SM text={`The above line created the ServiceEntry for secure https access to www.redhat.com. Notice we told the mesh it was external with the 
        'MESH_EXTERNAL' location value. We can test it working with a simple curl command from our pod running our backend application. Run the following 
        command to run a curl command from in the backend pod. The response should just indicate a successful request with a 200 response code.`} />
        <CodeSnip text={`oc exec -it $(oc get pod -l app=backend-deploy,version=v1 -o jsonpath={.items..metadata.name}) -c void-backend -- curl -I https://www.redhat.com/en | grep "HTTP/"`} />
        <Image path={IMG1} text="Successful curl from inside pod" />
        </ListItem>
        <ListItem>
            <BodyText text="Setting an Egress Rule with a VirtualService" />
            <BodyText SM text={`Now that we know our pod can hit that external service, we can set some rules for it to follow in the future. `} />
            <CodeSnip M text={
`cat << EOF > virtual_service_egress.yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: redhat-ext
spec:
  hosts:
    - redhat.com
  http:
  - timeout: 3s
    route:
      - destination:
          host: redhat.com
EOF
oc apply -f virtual_service_egress.yaml`} />
            <BodyText SM text={`This exmplifies that VirtualServices can also apply to external sources. This simple one just limits timeouts to 3 seconds. This is just an example,
            maybe in the future we'll go more in depth into egress sources. Also note by default, the ServiceMesh allows your pods to hit any external sources you'd like. It would require some istio 
            configuration editing to change that. If requested could be something we delve into deeper in the future.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Summary" />
          <BodyText SM text={`This was just a nice simple view into how you would go about adding an external service using a ServiceEntry istio resource. This just allows 
          the user to specify an allowed resource for your internal services to use. You can change it so it can manipulate you to allow access to a set of domains and more. I encourage you to read up 
          on egress specific istio stuff by following the link below if you're so interested. We also create another VirtualService that allows us to set some rules regarding our external resource. 
          Here we set a simple timeout limit, but you could theoretically disallow or allow a plethera of rules that you'd like. Our example application doesn't really require external sources, so it 
          seemed a bit of scope for this tutorial.`} />
          <UnorderedList nested>
            <ListItem><a rel="noopener noreferrer" href={'https://istio.io/docs/tasks/traffic-management/egress/'} target='_blank'>Link for isitio egress information.</a></ListItem>
          </UnorderedList>
        </ListItem>
      </UnorderedList>
  </Content>
);
export default EighthPage;
