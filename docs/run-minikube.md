# Run on Minikube

We are presenting here a short summary on how to run this application on [minikube](https://github.com/kubernetes/minikube).

## Pre-requisites
* minikube is installed and running on your computer
* docker CLI is installed on your computer
* start minikube with the command `minikube start`
* get IP address of the minikube virtual machine. 192.168.99.100

## Step 1: connect docker to minikube
Kubernetes has its own docker image registry so to build a new image into this repository you need connect the docker CLI to it. The commands below set the DOCKER_HOST to point to minikube, and then list the current docker images
```
$ eval $(minikube docker-env)
$ docker images
```
This step should be done only one time, or when using back your local repository.

## Step 2: Build a docker image of the app.
The project folder has a Dockerfile to prepare an image, so the following command will build this image and deploy it, into minikube private registry.

```
$ docker build -t case/webportal:v0.0.1 .
$ docker images
```

## Step 3: Create yaml files for the app and the service
The webportal.yaml is used for the Case Inc Portal Web App deployment to Kubernetes.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: casewebportal
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: casewebportal
    spec:
      containers:
      - name: casewebportal
        image: case/webportal:v0.0.1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 6100
```

And to expose the web app to the external world we build the following service:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: case-service
  labels:
    run: case-service
spec:
  type: NodePort
  ports:
  - port: 6100
    protocol: TCP
  selector:
    app: casewebportal
```

## Step 4: deploy
To deploy the app the first time
```
$ kubectl create -f webportal.yaml -f web-svc.yaml -f case-configmap.yaml
```

To redeploy
```
$ kubectl replace --force -f webportal.yaml
```

## Step 5: Validate Deployment
```
$ kubectl get pod

$ kubectl describe pod casewebportal-169209453-86m6x

# get the port mapping between the static one for the webapp running in the pod and the service one
$ kubectl get service

NAME           CLUSTER-IP   EXTERNAL-IP   PORT(S)          AGE
case-service   10.0.0.62    <nodes>       6001:31469/TCP   22h
kubernetes     10.0.0.1     <none>        443/TCP          2d
web-service    10.0.0.50    <nodes>       80:32026/TCP     1d
```

Point a browser to the URL : http://192.168.99.100:31469 to access the Case Inc Portal.
