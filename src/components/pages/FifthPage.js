import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";
import CodeSnip from "../util/CustomCodeSnip";
import Image from '../util/Image';
// == Assets ==
import IMG1 from '../../assets/pg5-1.png';
import IMG2 from '../../assets/pg5-2.png';
import IMG5 from '../../assets/pg5-5.png';
import IMG7 from '../../assets/pg5-7.png';
import IMG8 from '../../assets/pg5-8.png';
import IMG9 from '../../assets/pg5-9.png';
import IMG10 from '../../assets/pg5-10.png';
import IMG11 from '../../assets/pg5-11.png';
import IMG12 from '../../assets/pg5-12.png';
import IMG13 from '../../assets/pg5-13.png';
import IMG14 from '../../assets/pg5-14.png';
import IMG15 from '../../assets/pg5-15.png';
import IMG16 from '../../assets/pg5-16.png';
import IMG17 from '../../assets/pg5-17.png';
import IMG18 from '../../assets/pg5-18.png';
import IMG19 from '../../assets/pg5-19.png';


const FifthPage = () => (
  <Content>
      <Header text="Using Kiali"/>
      <UnorderedList>
        <ListItem>
          <BodyText text="Getting Started with Kiali - Generating Traffic" />
          <BodyText SM B text="** Please make sure your env variables for MESH_PROJ and APP_PROJ are still set as always! **" />
          <BodyText SM text={`Kiali provides a console that sort of centralizes all the information from istio and your service mesh configuration.
            It will allow us to look at the metrics as well as integrations for Grafana and Jaeger. However, our application probably doesn't have a whole lot of traffic generated right now, so let's go ahead and do that.
            Now, you could go ahead and refresh the web page from the last section and log in and out many times, or you could just run the command below. The choice is yours.
            If you run the script, just hit 'ctrl + c' whenever you want to end it or wait about 2-3 minutes to complete, you can also just move on while it runs.`} />
          <BodyText SM B text="** Note: You'll require wget and jq for the command to run properly. **" />
          <CodeSnip M text={
`export GATEWAY="$(oc get route -n $MESH_PROJ istio-ingressgateway -o jsonpath='{.spec.host}')"
wget https://raw.githubusercontent.com/carnsds-ibm/backend-openliberty-demo/master/traffic.sh
chmod +x traffic.sh
sh traffic.sh`} />
        </ListItem>
        <ListItem>
          <BodyText text="Getting into Kiali"/>
          <BodyText SM text={`So now that we have some traffic generated, let's head over to the Kiali console. 
            You can get there two ways, either through the UI in your <initials>-istio-system project or run a command to get the route and open that in the browser of choice.`}/>
          <Image path={IMG1} text="Method 1 of getting to Kiali Dashboard" />
          <BodyText SM text={`Above is the UI approach and below is the Command line to browser approach.`} />
          <CodeSnip text="oc get routes -n $MESH_PROJ | grep kiali" />
          <Image path={IMG5} text="Method 2 of getting to Kiali Dashboard" />
        </ListItem>
        <ListItem>
          <BodyText text="Making some sense of the Overview"/>
          <BodyText SM text={`When presented with the Overview after you first get into the Kiali console, you'll see cards for your two projects we made and also that your <initials>-application
           project may have an error in the istio config status. This is due to some istio native functionality in our DestinationRules not "meshing" (no pun intended) well with our DeploymentConfig for our frontend deployment, as istio was built with normal Deployments in mind. 
           However, in OCP, in order to get a service account to stick to your deployment better, we need a DeploymentConfig. So rest assured, it's working, but it is a weird bug to keep in mind as of this tutorial writing. See image below for example.`} />
          <Image path={IMG8} text="Kiali Overview." />
        </ListItem>
        <ListItem>
          <BodyText text="Switching to the Graph view" />
          <BodyText SM text={`Next, we'll click on the graph view and ensure we switch our name space to our <initials>-application project. 
            This graph is sort of one of the wow factors of Kiali, you can change some settings and also click on the routes to view what type of traffic it is and see the different versions of your app. 
            The traffic also gives you a percentage of success/failure and denotes with green and red respectively. Hopefully, all of your traffic is green as of now. Below I've navigated to the graph view of my 
            application and switched it to show the last hour of traffic.`} />
            <Image path={IMG2} text="Application in kiali with traffic." />
            <BodyText SM text={`In the above image, we can see the traffic goes from our ingress gateway to our frontend and backend services. You can also see that v1 and v2 versions are indeed in use and have had 100% request success. 
            You can also see that the http traffic is green (or possibly red if errors occurred) and the tcp traffic is denoted with a darker blue to our DB and Redis services, just an interesting feature to note how it differentiates the traffic. 
            Now let's switch views to the service view and turn on traffic and security options to show a little more detail about the request data.`} />
            <Image path={IMG7} text="Service view of traffic" />
            <BodyText SM text={`The above image exemplifies some of the options available to your visualization of traffic in Kiali. First, we changed our view to only show the services instead of the underlying deployments they expose. 
            Next, we turned on the traffic animation option, which allows us to see the flow of traffic between the services. We also enable the security option, which if you look closely, you see a lock on the route between 
            the gateway and the backend-service. This is due to us enabling mutual TLS in our destination rule for the backend, if you go back, you'll see we did not do that for the frontend destination rules, just so you can see that it is working. 
            I encourage you to play around with some more options/views if you're interested!`} />
        </ListItem>
        <ListItem>
          <BodyText text="Switching to the Application view" />
          <Image path={IMG9} text="Kiali Application view" />
          <BodyText SM text={`In the application view, we can see that only our backend-deploy has a green check in the health column. I didn't bother making the mongo and redis deployments fully istio configured, but that could 
          be a fun challenge if you'd like to. Then the frontend technically is fully configured, but because of the DestinationRules not recognizing the DeploymentConfig properly as discussed earlier, it thinks it isn't properly configured. 
          Now we'll dig a little deeper into the backend-deploy application, so go ahead and click on the backend-deploy name when ready. Note you may have to change the time to the last hour or so if you're not seeing anything, I have mine set on the last 3hrs.`} />
          <Image path={IMG10} text="Backend Application overview in Kiali." />
          <BodyText SM text={`In the application overview view, we get a brief summary on the right of the traffic health and also the workloads and services associated with the backend application. 
          Let's switch tabs over to traffic to take a slightly more in depth view of the traffic associated with the application.`} />
          <Image path={IMG11} text="Traffic overview of Backend Application in Kiali." />
          <BodyText SM text={`Now in the traffic tab of our backend application, as seen above, you can see the amount of traffic, success rate, and type of the requests. In this case we had a mix of HTTP and vanilla TCP traffic with a 100% success rate, 
          excellent! Let's take a closer look at the inbound traffic now.`} />
          <Image path={IMG12} text="Inbound Metrics overview of backend in Kiali" />
          <BodyText SM text={`The inbound traffic as pictured above, is only HTTP as expected, you'd have to scroll down more to see TCP traffic, but there won't be any metrics since there is no inbound TCP. The requests are sent over http traffic from our frontend (or curl from the script).
          You can see the volume and duration graphed at the top and if you scroll down a little more you can see the sizes of the request and responses. All very useful data for any production application. 
          Next we'll take a glance at the outbound metrics.`} />
          <Image path={IMG13} text="Outbound Metrics overview of backend in Kiali" />
          <BodyText SM text={`Since MongoDB and Redis communicate over TCP, it's fair to say we'd see outbound tcp traffic from our backend only. Aaand that's exactly what happened. After navigating to outbound metrics tab, 
          scroll down to where you see 'TCP received' and 'TCP sent' to have a quick view at the size and duration of some of the requests.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Workloads" />
          <Image path={IMG14} text="Workloads in Kiali" />
          <BodyText SM text={`The workloads section shows the applications that are actually handling the business logic of the requests. Let's 
          go ahead and click on the first one, backend-deploy and take a closer look again.`} />
          <Image path={IMG15} text="Backend Workload overview in Kiali" />
          <BodyText SM text={`So inside of the workload for backend-deploy, we can see that it's very similar to the application overview. There are tabs for traffic, metrics, and logs - oh my! They all give pretty much the same details, except for only this one workload instance of the application. 
          Now, we'll just take a look at the logs tab since that's more unique and you may play with the other tabs at your leisure.`} />
          <Image path={IMG16} text="Backend Workload logs example" />
          <BodyText SM text={`As you can see, in the logs tab you can choose which pod of that deployment or workload to view. So if you had it scaled up to three or so, you could choose whichever pod's and the container of the pod in which to view said logs. Then, you know, view those logs.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Services" />
          <Image path={IMG17} text="Services Overview in Kiali" />
          <BodyText SM text={`In the services overview, we can see the services involved in our application nicely listed out. You can see that only the frontend and backend were configured completely for the Service Mesh since those are the main two of interest. Click on the backend-service to continue.`} />
          <Image path={IMG18} text="Backend Service Overview in Kiali" />
          <BodyText SM text={`So now that we're inside of the backend-service, we can see a few things. Similarly to the last couple sections, you get tabs for traffic and inbound/outbound metrics. 
          You also get another sections of tabs to view the associated istio resources such as VirtualServices and DestinationRules, as well as your workloads. Feel free to click on those bottom tabs and explore the resources as you wish.
          The traces tab won't display anything right now, in your code you'd have to include the OpenTracing library and set that up. Istio provides some out of the box traces, we'll use later in the Distributed Tracing section.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Istio Config" />
          <Image path={IMG19} text="Istio Config Overview" />
          <BodyText SM text={`The istio config overview tab just gives you a nice location for all your istio related files that you've applied. You can view the yaml and also see if any aren't properly configured. For instance, 
          the frontend-service DestinationRule seems to be acting up for the reason discussed previously. Everything else seems to be in order though, feel free to peer around the yamls with the resources presented if you want before continuing.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Summary" />
          <BodyText SM text={`In this section, we've looked at all the views that the Kiali console provides and gave a brief insight into all the resources 
          it covers. However, we did not click the distributed tracing link as that will just take you to the Jaeger UI that we'll touch on later. Overall though, Kiali 
          provides a really nice centralized location for a lot of traffic data for our application. We can look at metrics for services and deployments, view the traffic in 
          a nice graph for our application, and view logs for specific workload pods and containers.`} />
        </ListItem>
      </UnorderedList>
  </Content>
);
export default FifthPage;
