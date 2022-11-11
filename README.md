# service-template
This repo contains the backend for the yassir E-care app for the company internal hackaton.

## Overview
The service:

* Runs on [Node/Express](https://expressjs.com/)

* Built on [Cloud Build](https://cloud.google.com/cloud-build/docs/overview)

* Docker image is registered in [Cloud Registry](https://cloud.google.com/container-registry/docs/quickstart)

* Application is deployed to [Cloud Run](https://cloud.google.com/cloud-build/docs/deploying-builds/deploy-cloud-run)

* Leverages [GCP PubSub](https://cloud.google.com/pubsub/docs/quickstart-client-libraries) for asynchronous message handling

## Usage and Information
#### Node/Express
Fork or clone this repo. Then install the dependencies, make sure the tests are passing and the code is properly linted.

* Installing dependencies
```
npm i
```

* Running tests
To run our unit tests you can run:

```
npm run test
```

* Running lint
To lint the code run:

```
npm run lint
```
If you don't get any output that means your linting passed.

#### Cloud Build
Cloud build handles building and deploying the application in a continuous way. 

1.  After forking this repo, [create a trigger](https://cloud.google.com/cloud-build/docs/automating-builds/create-manage-triggers) to automate the CI/CD process.

2.  Add the following environment variables to the trigger.
```
_APP_ENV => ENUM['production', 'staging']
_IMAGE => found in Cloud Registry console
_PROJECT_ID => found in GCP console
_REGION => found in Cloud Run console
_SERVICE_NAME => found in Cloud Run console
```

You can additionally add any other variables that you deem appropriate.

3.  If you add any additional variables, other than the ones specified above. Go the this repo's `cloudbuild.yaml`, then update the `env` parameter for first step with the variables that you added to the trigger.
```
- name: 'gcr.io/cloud-builders/docker'
  entrypoint: 'bash'
  args: ['-c', 'printenv > .env']
  env:
    - '_APP_ENV=$_APP_ENV'
    - '_NEW_TEST_ENV=$_NEW_TEST_ENV'
```

This assures that your environment variables are pulled into the docker container during the build process.

#### Cloud Registry
Cloud registry documents all the successfully built versions of your application. It is allows for easily reverting back to a previously working version of your service, when and if the current version is broken.

#### Cloud Run
The application is deployed to cloud run, a fully managed computer platform for deploying and scaling containers. It allows us to easily deploy these services without having to worry about autoscaling.


#### GCP PubSub
PubSub serves as the orchestration layer for the entire system.

* Before subscribing to a specific type of message, [make sure that the subscription exists and is still active](https://console.cloud.google.com/cloudpubsub/subscription/list).

* [Set up push subscriptions](https://cloud.google.com/run/docs/triggering/pubsub-push).

* Before publishing to a topic, [make sure that the topic exists and is still active](https://console.cloud.google.com/cloudpubsub/topic/list).

* To publish a message, leverage the `publishMessage` function in `~/pubsub/publishMessage.ts`

#### GCP PubSub on Cloud Run
Your Cloud Run deployed application must be given authorization to publish to the topic and listen to the subscription.

* [Authorize your application](https://cloud.google.com/run/docs/triggering/pubsub-push)

## Building Locally
Run you build locally before triggering a Cloud Build process. You will need to [download the latest docker](https://docs.docker.com/docker-for-mac/install/) on your machine beforehand.

* [Local Build](https://cloud.google.com/cloud-build/docs/build-debug-locally)


## Additional Information

- [More Details About PubSub Publishing](https://cloud.google.com/pubsub/docs/publisher#node.js)

## Authors

* **Faith Omojola** - *Backend Engineer*
