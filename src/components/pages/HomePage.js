import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import { ListItem, UnorderedList } from "carbon-components-react";
import Header from "../header/BasicHeader";
import LabelHeader from '../header/LabelHeader';
import CodeSnip from '../util/CustomCodeSnip';
import BodyText from '../text/BodyText';


const HomePage = () => (
  <Content>
      <Header text="Welcome"/>
      <BodyText text={`In this tutorial, We will discuss and run through a demo of using Red Hat Service Mesh.`}/>
      <BodyText text='Please follow along the steps carefully and check that you meet the following requirements:'/>
      
      <LabelHeader text='Requirements' />
        <UnorderedList>
          <ListItem> <BodyText SM B text='oc CLI tool.'/></ListItem>
          <UnorderedList nested>
          <ListItem><BodyText SM B text="Run the following to check: (If there was output about openshift commands, you're good to go.)" /><CodeSnip text='oc' /></ListItem>
            <ListItem><a rel="noopener noreferrer" href={'https://docs.openshift.com/container-platform/3.6/cli_reference/get_started_cli.html'} target='_blank'>Link for CLI download if needed.</a></ListItem>
          </UnorderedList>
          <ListItem><BodyText SM B text='Openshift cluster (4.X preferred)' /></ListItem>
          <ListItem><BodyText SM B text='Red Hat (Maistra) Service Mesh installed'/></ListItem>
          <UnorderedList nested>
            <ListItem><a rel="noopener noreferrer" href={'https://docs.openshift.com/container-platform/4.3/service_mesh/service_mesh_install/preparing-ossm-installation.html'} target='_blank'>Link for installation guide if needed.</a></ListItem>
          </UnorderedList>
          <ListItem><BodyText SM B text="*Also Make sure you're in a directory you don't mind having a lot of yaml files in."/></ListItem>
          <ListItem><BodyText SM B text='Please remember to replace text in angled brackets! For instance, "<Enter name>" would become "Johnny".'/></ListItem>
        </UnorderedList>
      <LabelHeader text='What we will be deploying' />
      <BodyText SM text={'A simple distributed application that allows users to create and delete articles and view articles from other users. '
        + 'This application will have a mongodb instance, redis and an Eclipse Microprofile running on Open Liberty backend. The frontend was ' 
        + ' created with ReactJS and is served on a nginx container. AKA, THE VOID.'}/>
      <LabelHeader text='Steps:' />
        <UnorderedList>
          <ListItem><BodyText B SM text='Setup - Create a new project and add it to the Service Mesh Control Plane' /></ListItem>
          <ListItem><BodyText B SM text='Configuration - Create the necessary files in order to analyze and make the application later.'/></ListItem>
          <ListItem><BodyText B SM text='Install Application - Create Deployment Configs of the application to monitor with Service Mesh'/></ListItem>
          <ListItem><BodyText B SM text='Using Kiali - A view into some of the features Kiali provides for the application'/></ListItem>
          <ListItem><BodyText B SM text='Grafana - Using Grafana to view metrics'/></ListItem>
          <ListItem><BodyText B SM text='Distributed Tracing - Using Jaeger to view Distributed Tracing'/></ListItem>
          <ListItem><BodyText B SM text='Egress - How to add external resource access if needed'/></ListItem>
          <ListItem><BodyText B SM text='Cleanup & Contact - Deletion of projects and contact email' /></ListItem>

        </UnorderedList>
  </Content>
);
export default HomePage;