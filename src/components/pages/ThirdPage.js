import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import Image from '../util/Image';
import CodeSnip from '../util/CustomCodeSnip';
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from '../text/BodyText';

// == ASSETTS ==
import IMG1 from '../../assets/pg3-1.png';

const ThirdPage = () => (
  <Content>
      <Header text="Configuration"/>
      <UnorderedList>
        <ListItem>
          <BodyText text='First, let us ensure that the setup went swimmingly.' />
          <BodyText SM text='Navigate, in developer mode, to your <initials>-istio-system project and checkout the topology. If you see similar to the image below, you are good to go! Otherwise, repeat setup.' />
          <BodyText SM B text="** Please make sure all the pods in your <initials>-istio-system are completely up before continuing **" />
          <Image path={IMG1} text='Service Mesh completed setup' />
          <BodyText B SM text={`** Please ensure the $APP_PROJ and $MESH_PROJ environment variables are still set before proceeding! **`} />
          <CodeSnip M text={
`echo $APP_PROJ
echo $MESH_PROJ`} />
        </ListItem>
        <ListItem>
          <BodyText text="Next, let's create some files for the application to use and some files to leverage the service mesh" />
          <BodyText SM text="Let's switch to our <initials>-application project using the CLI" />
          <CodeSnip text="oc project $APP_PROJ" />
        </ListItem>
        <ListItem>
          <BodyText text="Service Account Configuration" />
          <BodyText SM text="We'll start with the service account needed for some of these deployments to overcome ocp permission errors, like nginx." />
          <CodeSnip M text={
`cat << EOF>serviceaccount.yaml
apiVersion: v1 
kind: ServiceAccount 
metadata:
  name: general 
EOF`} />
          <BodyText SM text="Next we'll apply the yaml and give the account some permissions with the three following commands." />
          <CodeSnip text={'oc apply -f serviceaccount.yaml'} />
          <CodeSnip text={'oc adm policy add-scc-to-user anyuid -z general -n $APP_PROJ'} />
          <CodeSnip text={'oc adm policy add-scc-to-user privileged -z general -n $APP_PROJ'} />
          <BodyText SM text="Technically the privileged role should provide all the access required, but for some reason the mongo and redis images sometimes acted up when running with it, so I added the anyuid and it fixed it." />
        </ListItem>
        <ListItem>
          <BodyText text="Application Housekeeping" />
          <BodyText SM text="Now, we will make a configmap and secret for some values for our application to utilize." />
          <CodeSnip text={'oc create secret generic void-secret --from-literal DB_ADMINPWD=admin --from-literal DB_ADMINUSER=admin'} />
          <BodyText SM text="The above line creates a secret for us and the below will create the configmap needed for our application environment variables. Now we'll grab the URL of our istio ingress gateway before creating our config map."/>
          <CodeSnip M text={
`export GATEWAY="http://$(oc get route -n $MESH_PROJ istio-ingressgateway -o jsonpath='{.spec.host}')"
cat << EOF>configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: void-config
data:
  BACKEND_URL: $GATEWAY
  DB_HOST: mongo-service
  DB_PORT: "8081"
  R_HOST: redis-service
  R_PORT: "6379"
EOF
oc apply -f configmap.yaml`} />
          <BodyText SM text="The configmap creates 4 variables and ports for our application to refer to."/>
        </ListItem>
        <ListItem>
          <BodyText text="Istio Configuration - Virtual Services" />
          <BodyText SM text={`Now that we have the application housekeeping out of the way, we can add some configuration for istio to route and analyze traffic to our application. First, we will setup our Virtual Services. 
          Simply put, these act as the routing rules. Very similar to HAproxy configuration or other load balancer rules. 
          You also define the weights and possibly some other rules for canary testing. You can see I've put a 80/20 split on the frontend services (that we will deploy in next section) and a 90/10 on the backend. 
          You can specify all sorts of rules in a virtual service, such as, making it so that all Firefox users or users from specific ips would be directed to the v2 version of the frontend. Note: you can see in the selector istio key, we are using the default ingressgateway of the mesh.`}/>
          <CodeSnip M text={
`cat << EOF > istio_networking.yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: thevoid-gateway
spec:
  selector:
    istio: ingressgateway # use istio default controller
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: thevoid-vs
spec:
  hosts:
  - "*"
  gateways:
  - thevoid-gateway
  http:
  - match:
    - uri:
        prefix: /static
    - uri:
        prefix: /sockjs-node
    - uri:
        exact: /
    route:
    - destination:
        host: frontend-service
        subset: v1
        port:
          number: 80
      weight: 80
    - destination:
        host: frontend-service
        subset: v2
        port:
          number: 80
      weight: 20
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: thevoid-be-vs
spec:
  hosts:
  - "*"
  gateways:
  - thevoid-gateway
  http:
  - match:
    - uri:
        prefix: /User
    - uri:
        prefix: /Article
    route:
    - destination:
        host: backend-service
        subset: v1
        port:
          number: 80
      weight: 90
    - destination:
        host: backend-service
        subset: v2
        port:
          number: 80
      weight: 10
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: thevoid-be
spec:
  hosts:
  - "*"
  gateways:
  - thevoid-gateway
  http:
  - match:
    - uri:
        exact: /Calc
    rewrite:
        uri: /
    route:
    - destination:
        host: backend-service
        subset: v1
        port:
          number: 80
      weight: 90
    - destination:
        host: backend-service
        subset: v2
        port:
          number: 80
      weight: 10
---
EOF
oc apply -f istio_networking.yaml
`} />
        </ListItem>
        <ListItem>
          <BodyText text="Istio Configuration - Destination Rules" />
          <BodyText SM text={`Next we will apply some destination rules for the routing, this is necessary for the canary testing to function and further details how the communication 
            in the mesh works. For instance, adding mutual TLS on the services as seen in some of the rules.` }/>
          <CodeSnip M text={
`cat << EOF > destination_rules.yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: backend-service
spec:
    host: backend-service
    subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
    trafficPolicy:
      tls:
        mode: ISTIO_MUTUAL
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: frontend-service
spec:
    host: frontend-service
    subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: mongo-service
spec:
    host: mongo-service
    subsets:
    - name: v1
    labels:
        version: v1
    trafficPolicy:
      tls:
        mode: ISTIO_MUTUAL
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
    name: redis-service
spec:
    host: redis-service
    subsets:
    - name: v1
    labels:
        version: v1
    trafficPolicy:
      tls:
        mode: ISTIO_MUTUAL
EOF
oc apply -f destination_rules.yaml
`} />
        </ListItem>
        <ListItem>
          <BodyText text="Istio Configuration - Adding Metrics and a Prometheus Handler" />
          <BodyText SM text={`We will leverage Prometheus to query for some basic request data on the frontend and backend services. 
            You can then, visualize these as traffic is generated with Grafana or Kiali (which just shows data similar to grafana). 
            Each service requires it's own metric (instance) resource as well as a rule. However, the rules can reference the same handler resource for prometheus 
            to handle the rule execution as depicted in the spec.actions.handler of the rule yaml below. 
            Note: The metrics are applied to the application project, while the rule and prometheus resources are applied to the mesh project.` } />
          <CodeSnip M text={
`cat << EOF > metrics.yaml
apiVersion: "config.istio.io/v1alpha2"
kind: instance
metadata:
  name: requestcount-fe
spec:
  compiledTemplate: metric
  params:
    value: "1"
    dimensions:
      source: source.service | "unknown"
      destination: destination.service | "unknown"
      version: destination.labels["version"] | "unknown"
      user_agent: request.headers["user-agent"] | "unknown"
    monitored_resource_type: '"UNSPECIFIED"'
---
apiVersion: "config.istio.io/v1alpha2"
kind: instance
metadata:
  name: requestcount-be
spec:
  compiledTemplate: metric
  params:
    value: "1"
    dimensions:
      source: source.service | "unknown"
      destination: destination.service | "unknown"
      version: destination.labels["version"] | "unknown"
      user_agent: request.headers["user-agent"] | "unknown"
    monitored_resource_type: '"UNSPECIFIED"'
---
apiVersion: "config.istio.io/v1alpha2"
kind: handler
metadata:
  name: recommendationrequestcounthandler
  namespace: $MESH_PROJ
spec:
  compiledAdapter: prometheus
  params:
    metrics:
    - name: recommendation_request_count
      instance_name: recommendationrequestcount.metric.$MESH_PROJ
      kind: COUNTER
      label_names:
      - source
      - destination
      - user_agent
      - version
---
apiVersion: "config.istio.io/v1alpha2"
kind: rule
metadata:
  name: recommendationrequestcountprom
  namespace: $MESH_PROJ
spec:
  match: destination.service == "frontend-service.$APP_PROJ.svc.cluster.local"
  actions:
  - handler: recommendationrequestcounthandler.prometheus
    instances:
    - requestcount-fe.metric
---
apiVersion: "config.istio.io/v1alpha2"
kind: rule
metadata:
  name: recommendationrequestcount-backend
  namespace: $MESH_PROJ
spec:
  match: destination.service == "backend-service.$APP_PROJ.svc.cluster.local"
  actions:
  - handler: recommendationrequestcounthandler.prometheus
    instances:
    - requestcount-be.metric
EOF
oc apply -f metrics.yaml`} />
        </ListItem>
        <ListItem>
          <BodyText text="Summary" />
          <BodyText SM text={`Well done for making it this far! Istio is configured and ready for our application! 
            We first started with some housekeeping and adding some values to be used for our application, basic kubernetes stuff. 
            Then we added a gateway and some virtual services in order to control traffic into our ingress gateway, much like that of a load balancer. 
            Next the configuration of destination rules were made in order to specify traffic subsets and policy with mutual TLS, which allows for service to service authentication without having to really do much on our part, nifty! 
            Finally, we laid the foundation of the Prometheus derived metrics and rules for future analysis of traffic into our application.`} />
        </ListItem>
      </UnorderedList>
  </Content>
);
export default ThirdPage;