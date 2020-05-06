import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";
import CodeSnip from "../util/CustomCodeSnip";
import Image from '../util/Image';

// == ASSETTS ==
import IMG1 from '../../assets/pg6-1.png'
import IMG2 from '../../assets/pg6-2.png'
import IMG3 from '../../assets/pg6-3.png'
import IMG4 from '../../assets/pg6-4.png'
import IMG5 from '../../assets/pg6-5.png'
import IMG6 from '../../assets/pg6-6.png'


const SixthPage = () => (
  <Content>
      <Header text="Grafana"/>
      <UnorderedList>
        <ListItem>
          <BodyText text="Navigating to Grafana" />
          <BodyText SM B text="** Ensure your MESH_PROJ environment variable is set **" />
          <CodeSnip text="echo $MESH_PROJ" />
          <BodyText text={`In this section we'll take a quick look at Grafana and some the features it provides as it is installed as part of ServiceMesh. 
          Please navigate to the Grafana UI with one of the following methods.`} />
          <UnorderedList nested>
            <ListItem>
              <BodyText SM text="Using the OpenShift Console, go to you <initials>-istio-system project and click the route button." />
              <Image path={IMG1} text="UI navigation to grafana UI" />
            </ListItem>
            <ListItem>
              <BodyText SM text="Using the oc CLI, print the routes of your <initials>-application project and copy the grafana route into your browser." />
              <CodeSnip text="oc get routes -n $MESH_PROJ | grep grafana" />
              <Image path={IMG2} text="CLI aquisition of grafana route." />
            </ListItem>
          </UnorderedList>
          <BodyText SM text="Select 'Allow selected permissions' to move on to the UI if presented with the following screen." />
          <Image path={IMG3} text="Allow permission image" />
        </ListItem>
        <ListItem>
          <BodyText text="Getting to the Istio Workload Grafana Dashboard" />
          <BodyText SM text={`This tutorial really has already covered a lot of the basics of Service Mesh for general use. I'll show briefly how to navigate and look at Grafana, 
          but you'll need to play with it more yourself if you'd like to know more about Grafana specifically. First we'll take a look at how to get into our istio-workload dashboard.
           The different dashboards provide UIs to look at metrics. First click on the 'Home' link at the top left of the UI.`} />
          <Image path={IMG4} text="Home link in Grafana" />
          <BodyText SM text={`Next, we'll navigate to our istio workload dashboard. This dashboard will give us insight into the metrics 
          for the workloads we've configured in istio.`} />
          <Image path={IMG5} text="Grafana Istio Workload" />
          <BodyText SM text={`Here you could try navigating to the other dashboards provided by istio, when we're finished. 
          We'll just focus on the workloads data though.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Looking at the Istio Workloads Dashboard" />
          <Image path={IMG6} text="Image of Istio Workload Dashboard in Grafana" />
          <BodyText SM text={`In this dashboard, we can see the telemetry of all that istio covers for us. In the image below you see a legend assigning 
          different colors to some of the different services. You may view all sorts of different metrics that istio provides out of the box for these services by scrolling 
          down on the dashboard. This visualization representation of your metrics is the main cause for Grafana. You can potentially add custom metrics with Prometheus or otherwise
           and monitor them here as well, but that's a little out of scope for now. Maybe in the future that will be an added section.`} />
        </ListItem>
        <ListItem>
          <BodyText text="Summary" />
          <BodyText SM text={`Grafana is a customizable dashboard tool for visualizing metrics of your application/workload and has a lot of cool features. 
          It is definitely handy for checking when/where potentially erroneus network requests/responses are happening in your application. It's also 
          built into Red Hat Service Mesh, so definitely good to be familiar with navigating at least. Feel free to learn more at the link below:`} />
          <UnorderedList nested>
            <ListItem><a rel="noopener noreferrer" href={'https://grafana.com/tutorials/'} target='_blank'>Link for Grafana tutorial.</a></ListItem>
          </UnorderedList>
        </ListItem>
      </UnorderedList>
  </Content>
);
export default SixthPage;
