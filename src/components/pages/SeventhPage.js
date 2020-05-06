import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";
import CodeSnip from "../util/CustomCodeSnip";
import Image from '../util/Image';

// == ASSETTS ==
import IMG1 from '../../assets/pg7-1.png';
import IMG2 from '../../assets/pg7-2.png';
import IMG3 from '../../assets/pg7-3.png';
import IMG4 from '../../assets/pg7-4.png';
import IMG5 from '../../assets/pg7-5.png';
import IMG6 from '../../assets/pg7-6.png';


const SeventhPage = () => (
  <Content>
      <Header text="Distributed Tracing"/>
      <UnorderedList>
        <ListItem>
          <BodyText text="Navigating to Jaeger UI" />
          <BodyText SM text={`The Jaeger UI provides a nice interface for users to look at the traces throughout their application. It does this using 
          the OpenTracing open source project. OpenTracing APIs provides a way to add extra traces to your requests in code for almost all tech stacks. 
          This is especially useful for profiling and monitoring your microservices in your applications to see where failures or poorly performing services may be occuring.
          The istio envoy proxies come with some tracing built in that we will look at. Just like in the previous section, having that MESH_PROJ env variable set, may be handy as 
          we will navigate to the Jaeger UI in similar fashion. We can first go back to Kiali and access from that dashboard, or much like the previous, 
          either through Openshift Console or with CLI and browser. The Kiali method is pictured below.`} />
          <UnorderedList nested>
            <ListItem>
              <BodyText B SM text="Navigating to Jaeger with Kiali" />
              <Image path={IMG1} text="Kiali to Jaeger Picture." />
            </ListItem>
            <ListItem>
              <BodyText B SM text="Navigating with Openshift in your <initials>-istio-system project." />
              <Image path={IMG2} text="Jaeger route in Openshift" />
            </ListItem>
            <ListItem>
              <BodyText B SM text="Grab the route through the CLI using command below, and then paste in the browser URL." />
              <CodeSnip text="oc get routes -n $MESH_PROJ | grep jaeger" />
              <Image path={IMG3} text="Jaeger Route in CLI" />
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          <BodyText text="Searching for Traces in the Jaeger UI" />
          <BodyText SM text={`Below, you can see that I've selected the backend-service to trace. I've left all the other options default 
          for this example, but you can set how many traces you want to see with the 'Limit Results' field, the max and min duration of the 
          request traces of interest with the respective fields, insert tags looking for specific request information like response code, and how 
          far back you'd like the filter to apply to with the 'Lookback' field. Go ahead and select the backend service then click, 'Find Traces'.`} />
          <Image path={IMG4} text="Selecting backend service in Jaeger." />
        </ListItem>
        <ListItem>
          <BodyText text="Looking at the trace details." />
          <BodyText SM text={`Something similar to below is what will appear after you've clicked the 'Find Traces' button. 
          Note, I had to set my lookback to 3 hours to get results, so adjust accordingly. You're presented with 20 traces depicted on 
          a graph for duration vs time of occurence as well as a list of up to however many traces you specified in the 'Limit Results' field. You can click 
          on one in the list or one on the graph to get more information about the trace. Go ahead and click on one to dig into the details a little deeper.`} />
          <Image path={IMG5} text="Selecting trace in Jaeger" />
          <BodyText SM text={`Now that we've selected a trace we can view the tags associated with it and get some detailed information about it. Below we see a few things of interest. 
          First, we see the title of the trace indicates which virtual service was leveraged and then the port and path of the request. A bit further down, you see the service that was used and you can 
          expand the tags to get more request and response data. You can see the http url requested, the status code, size of response and request, what type of method, etc. If you had made your own trace 
          in code with an OpenTracing API, you could specify custom tags and expect they could be shown here as well!`} />
          <Image path={IMG6} text="Details of a trace in Jaeger." />
        </ListItem>
        <ListItem>
          <BodyText text="Summary" />
          <BodyText SM text={`In this section we touched on the importance of Distributed Tracing. How to navigate to the Jaeger UI, which comes with any current installation of the Maistra Service Mesh. 
          Then some brief explanation in querying for the default traces included with the istio proxy envoys that are injected into our pods. We also mentioned the existence of OpenTracing APIs that 
          can allow you to include custom traces in your code if the defaults don't include all the information desired. Then you could query for and view those in the Jaeger UI as well. 
          Feel free to familiarize yourself or learn more about OpenTracing below:`} />
          <UnorderedList nested>
            <ListItem><a rel="noopener noreferrer" href={'https://opentracing.io/docs/getting-started/tutorials/'} target='_blank'>Link for OpenTracing tutorial.</a></ListItem>
          </UnorderedList>
        </ListItem>
      </UnorderedList>
  </Content>
);
export default SeventhPage;
