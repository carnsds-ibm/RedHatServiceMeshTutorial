import React from "react";

import { Content } from "carbon-components-react/lib/components/UIShell";
import Header from "../header/BasicHeader";
import { UnorderedList, ListItem } from "carbon-components-react";
import BodyText from "../text/BodyText";
import CodeSnip from "../util/CustomCodeSnip";
import Image from '../util/Image';

// == ASSETTS ==
import IMG1 from '../../assets/pg4-1.png';
import IMG2 from '../../assets/pg4-2.png';
import IMG3 from '../../assets/pg4-3.png';

const FourthPage = () => (
  <Content>
      <Header text="Installation"/>
      <UnorderedList>
        <ListItem>
          <BodyText text="The Fun Part" />
          <BodyText SM text={"Here we'll just be leveraging those configurations and service account we made in the previous steps and deploying our application using ocp native DeploymentConfigs."
        + " At the end, we should have a working application, yay!"} />
          <BodyText B SM text="** Again, please ensure the MESH_PROJ and APP_PROJ environment variables are still set. **" />
          <CodeSnip M text={
`echo $APP_PROJ
echo $MESH_PROJ`} />
          <BodyText SM text="Let's begin by first ensuring we are on our application project." />
          <CodeSnip text={`oc project $APP_PROJ`} />
        </ListItem>
        <ListItem>
          <BodyText text="Deploying the Database (MongoDB)" />
          <BodyText SM text={"We'll create and deploy the following file in order to standup the database in authentication mode. Also note the * sidecar.istio.io/inject: \"true\" * annotation in the pod, all the following deployments will have the"
            + " same annotation for istio injection, you can enable auto injection in the Service Mesh Control Plane, but we are doing it manually just because. This first deploy config is called mongo-deploy and all the subsequent deployments will have similar naming convention, also just because."
            + " Note: we are using an empty dir for the DB, but feel free to change to a PVC if you want, this is obviously just a demo application though (same will apply to redis)."
            + " Also notice the version label, this is import for distinguising where traffic goes from the destination rules."} />
          <CodeSnip M text={
`cat << EOF > mongo_deploy_conf.yaml
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  name: mongo-deploy
  labels:
    app: mongo-deploy
    version: v1
spec:
  strategy:
    type: Rolling
    rollingParams:
      updatePeriodSeconds: 1
      intervalSeconds: 1
      timeoutSeconds: 600
      maxUnavailable: 25%
      maxSurge: 25%
    resources: {}
    activeDeadlineSeconds: 21600
  triggers:
    - type: ConfigChange
  replicas: 1
  selector:
    app: mongo-deploy
    version: v1
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: mongo-deploy
        tier: backend
        version: v1
    spec:
      containers:
        - image: mongo:3.6.17
          name: mongo
          env:
          - name: MONGO_INITDB_ROOT_USERNAME
            valueFrom:
              secretKeyRef:
                name: void-secret
                key: DB_ADMINUSER
          - name: MONGO_INITDB_ROOT_PASSWORD
            valueFrom:
              secretKeyRef:
                name: void-secret
                key: DB_ADMINPWD
          args: [ "--auth" ]
          ports:
          - containerPort: 27017
          volumeMounts:
          - name: data
            mountPath: /data/db
      volumes:
        - name: data
          emptyDir: {}
          securityContext:
            capabilities:
            privileged: true
            readOnlyRootFilesystem: false
            allowPrivilegeEscalation: true
      serviceAccountName: general
      serviceAccount: general
EOF
oc apply -f mongo_deploy_conf.yaml`} />
          <BodyText SM text={`Next we'll add a service to expose our DB deployment, normal ocp/kubernetes stuff.`} />
          <CodeSnip M text={
`cat << EOF > mongo_service.yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: mongo-deploy
  name: mongo-service
spec:
  ports:
  - port: 8081
    protocol: TCP
    targetPort: 27017
  selector:
    app: mongo-deploy
  type: ClusterIP
EOF
oc apply -f mongo_service.yaml`} />
        </ListItem>
        <ListItem>
          <BodyText text="Deploying the Redis instance"/>
          <BodyText SM text={"The following command to copy will create the redis deployment with the istio injection annotation as well."
            + "We also use an empty dir here as well, but again, feel free to use a PVC."} />
          <CodeSnip M text={
`cat << EOF > redis_deploy_conf.yaml
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  labels:
    app: redis-deploy
    version: v1
  name: redis-deploy
spec:
  strategy:
    type: Rolling
    rollingParams:
      updatePeriodSeconds: 1
      intervalSeconds: 1
      timeoutSeconds: 600
      maxUnavailable: 25%
      maxSurge: 25%
    activeDeadlineSeconds: 21600
  triggers:
    - type: ConfigChange
  replicas: 1
  selector:
    app: redis-deploy
    version: v1
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: redis-deploy
        tier: backend
        version: v1
    spec:
      serviceAccount: general
      serviceAccountName: general
      containers:
      - image: redis:alpine
        name: redis
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: data
          mountPath: /data
      volumes:
      - name: data
        emptyDir: {}
EOF
oc apply -f redis_deploy_conf.yaml`} />
          <BodyText SM text={`Now add a service to expose our redis deployment.`} />
          <CodeSnip M text={
`cat << EOF > redis_service.yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: redis-deploy
  name: redis-service
spec:
  ports:
  - port: 6379
    protocol: TCP
    targetPort: 6379
  selector:
    app: redis-deploy
  type: ClusterIP
EOF
oc apply -f redis_service.yaml`} />
        </ListItem>
        <ListItem>
          <BodyText text="Deploying the Backend - Open Liberty"/>
          <BodyText SM text={`This deployment deploys the Java backend written with MicroProfile.
            This leverages the configmap considerably and is responsible for the communication between redis, MongoDB and the frontend. However, we will have to make two deployments of this to exemplify canary testing.
            The first one will have the 'version: v1' label.`} />
          <CodeSnip M text={
`cat << EOF > backend_deploy1.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: backend-deploy
    version: v1
  name: backend-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend-deploy
      version: v1
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      creationTimestamp: null
      labels:
        app: backend-deploy
        version: v1
        tier: backend
    spec:
      containers:
      - env:
        - name: DB_ADMINUSER
          valueFrom:
            secretKeyRef:
              key: DB_ADMINUSER
              name: void-secret
        - name: DB_ADMINPWD
          valueFrom:
            secretKeyRef:
              key: DB_ADMINPWD
              name: void-secret
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              key: DB_HOST
              name: void-config
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              key: DB_PORT
              name: void-config
        - name: R_HOST
          valueFrom:
            configMapKeyRef:
              key: R_HOST
              name: void-config
        - name: R_PORT
          valueFrom:
            configMapKeyRef:
              key: R_PORT
              name: void-config
        image: dennismila/backend-void:1.2
        imagePullPolicy: IfNotPresent
        name: void-backend
        ports:
        - containerPort: 9080
        resources:
          requests:
             cpu: 200m
EOF
oc apply -f backend_deploy1.yaml`} />
          <BodyText SM text={`The next will have version v2 and act as one of our "canary" test subjects as if it was a newer version when in reality, it is simply the same. It is nothing but a lie, shhh.`} />
          <CodeSnip M text={
`cat << EOF > backend_deploy2.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: backend-deploy
    version: v2
  name: backend-deploy-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend-deploy
      version: v2
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: backend-deploy
        tier: backend
        version: v2
    spec:
      containers:
      - image: dennismila/backend-void:1.2
        name: void-backend
        ports:
        - containerPort: 9080
        env:
        - name: DB_ADMINUSER
          valueFrom:
            secretKeyRef:
              name: void-secret
              key: DB_ADMINUSER
        - name: DB_ADMINPWD
          valueFrom:
            secretKeyRef:
              name: void-secret
              key: DB_ADMINPWD
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: void-config
              key: DB_HOST
        - name: DB_PORT 
          valueFrom:
            configMapKeyRef:
              name: void-config
              key: DB_PORT
        - name: R_HOST
          valueFrom:
            configMapKeyRef:
              name: void-config
              key: R_HOST
        - name: R_PORT
          valueFrom:
            configMapKeyRef:
              name: void-config
              key: R_PORT
EOF
oc apply -f backend_deploy2.yaml`} />
          <BodyText SM text={`Now we'll need to add only one service as the istio routing rules and envoy proxies (sidecars), will handle the rest.`} />
          <CodeSnip M text={
`cat << EOF > backend_service.yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: backend-deploy
  name: backend-service
spec:
  ports:
  - port: 80
    name: http
    protocol: TCP
    targetPort: 9080
  selector:
    app: backend-deploy
EOF
oc apply -f backend_service.yaml`} />
        </ListItem>
        <ListItem>
          <BodyText text="Deploying the Frontend - ReactJS on Nginx"/>
          <BodyText SM text={`This, faithful readers, is the final deployment necessary. This one will also have "two" versions for canary testing with the weights specified back in the virtual services.
            Without further ado, let's go ahead and deploy them!`} />
          <CodeSnip M text={
`cat << EOF > frontend_deploy1.yaml
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  name: frontend-deploy
  labels:
    app: frontend-deploy
    version: v1
spec:
  strategy:
    type: Rolling
    rollingParams:
      updatePeriodSeconds: 1
      intervalSeconds: 1
      timeoutSeconds: 600
      maxUnavailable: 25%
      maxSurge: 25%
    resources: {}
    activeDeadlineSeconds: 21600
  triggers:
    - type: ConfigChange
  replicas: 1
  selector:
    app: frontend-deploy
    version: v1
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: frontend-deploy
        version: v1
    spec:
      containers:
        - name: void-frontend
          ports:
            - containerPort: 80
              protocol: TCP
          resources:
            requests:
             cpu: 125m
          env:
            - name: BACKEND_URL
              valueFrom:
                configMapKeyRef:
                  key: BACKEND_URL
                  name: void-config
          securityContext:
            capabilities:
            privileged: true
            readOnlyRootFilesystem: false
            allowPrivilegeEscalation: true
          imagePullPolicy: Always
          terminationMessagePolicy: File
          image: carnsds/frontend-void:1.3
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      serviceAccountName: general
      serviceAccount: general
EOF
oc apply -f frontend_deploy1.yaml`} />
        <BodyText SM text="And for version two:" />
        <CodeSnip M text={
`cat << EOF > frontend_deploy2.yaml
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  name: frontend-deploy-canary
  labels:
    app: frontend-deploy
    version: v2
spec:
  strategy:
    type: Rolling
    rollingParams:
      updatePeriodSeconds: 1
      intervalSeconds: 1
      timeoutSeconds: 600
      maxUnavailable: 25%
      maxSurge: 25%
    resources: {}
    activeDeadlineSeconds: 21600
  triggers:
    - type: ConfigChange
  replicas: 1
  selector:
    app: frontend-deploy
    version: v2
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: frontend-deploy
        version: v2
    spec:
      containers:
        - name: void-frontend
          ports:
            - containerPort: 80
              protocol: TCP
          resources:
            requests:
             cpu: 125m
          env:
            - name: BACKEND_URL
              valueFrom:
                configMapKeyRef:
                  key: BACKEND_URL
                  name: void-config
          securityContext:
            capabilities:
            privileged: true
            readOnlyRootFilesystem: false
            allowPrivilegeEscalation: true
          imagePullPolicy: Always
          terminationMessagePolicy: File
          image: carnsds/frontend-void:1.3
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      serviceAccountName: general
      serviceAccount: general
EOF
oc apply -f frontend_deploy2.yaml`} />
        <BodyText SM text={`Note the name of the following service's port, a name is necessary for proper istio configuration and we only named the backend and frontend ports, but you could definitely play around with other names.
          Now, the final service to top it off:`} />
        <CodeSnip M text={
`cat << EOF > frontend_service.yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: frontend-deploy
    service: frontend-service
  name: frontend-service
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: frontend-deploy
  type: ClusterIP
EOF
oc apply -f frontend_service.yaml`} />
        </ListItem>
        <ListItem>
          <BodyText text="Now to see that the application is running!" />
          <BodyText SM text="Run the following command and grab the istio-ingressgate-way route to checkout your newly deployed app in the browser!" />
          <CodeSnip text={`oc get route -n $MESH_PROJ`} />
          <Image path={IMG1} text="how to grab the right ingress route" />
          <BodyText SM text="Copy that text and navigate there in the browser, alternatively you can grab the route within the cluster in the mesh project." />
          <Image path={IMG2} text="Working App proof." />
          <BodyText B SM text="If you see similar to the above and are able to create an account and mess around, then congratulate yourself, you've got it working properly!" />
          <BodyText SM text="Another thing to check and see if it's setup properlym run the following command and just check that each running pod has 2 containers. This would indicate that the istio sidecar injection (envoy proxy) was successful." />
          <CodeSnip text="oc get pods"/>
          <Image path={IMG3} text="Proof 2 of working application." />
        </ListItem>
        <ListItem>
          <BodyText text="Summary" />
          <BodyText SM text={`In this step, we've deployed our application and added istio injection annotations to each Pod in our DeploymentConfigs and Deployments and also added services to expose them internally in the cluster.
            Because of the virtual services we setup, our ingress gateway know's which envoy proxies (istio sidecars) on the pods to direct traffic to and we can officially start taking a look at that traffic data in the next section.
            ** Note: There is a reason we used Deployments for one and DeploymentConfigs for the different services that we will run into later.` } />
        </ListItem>
      </UnorderedList>  
  </Content>
);
export default FourthPage;
