# SCANIA gateway

![Screenshot](docs/scania-gateway.jpg)

This is a gateway to connect different environments being able to create communications between them.

On the file src/config/environments.ts we have the configuration of every environment that we want to use. We can also disable any of them by setting the use function to false. Be aware that some environments are essential for the correct operation of the project.

On the folder src/clients and src/router we have the base configuration to create the different environments.

On the folder src/controllers we have the request's swagger definition that we can make to the api and how to act when we recieve them.
On the mqtt folder we have the listeners to the different topics that have been provided in the configuration of the MQTT.

On the folder src/data we have the swagger definition data requests and the data definition that we use in the project.

On the folder src/services we have the communication to the environment base on the rest api request and how to handle the different responses.

On the folder src/store we have the local storage configuration and the different types of data that we store with the functions that we can do.

When we launch the project for the first time the folder logs will be created with the log file of current date. Everything that we see in the console is also written in the log file.

The local storage is store in the folder storage, this folder will be created when we store data for the first time. Each storage will be created and removed whenever we need.

## Getting started 🚀

The instructions below will allow you to get a copy of this project running in your computer for development and tests purposes.

## Requirements 📋

* Basic knowledge of NodeJs projects
* Advanced knowledge in Typescript/Javascript language
* Have NodeJs installed in the local machine that we are going to use

## Installation 🔧

First of all, we will clone the repository using the command prompt:

```
git clone https://code.siemens.com/gateways/scania/scania-gateway.git -b develop
or
git clone git@code.siemens.com:gateways/scania/scania-gateway.git -b develop
```

Then we will need to install the modules that we are using in the project that are defined in the package.json:

```
npm install
```

## Usage 📦

We can launch the application using one of these commands:

```
npm start
or
npx ts-node src/main.ts
```

_Note: to make secured requests to the Api we will need the certifications, you can ask any member of the project to provide them to you or make your own certficates._

After seeing the message that the Api is running in port X we can go to the host provided in the config (or to localhost if not provided) and make requests using swagger.

![Screenshot](docs/swagger-example.png)

This is an example of the swagger page, to get here we use the url
```
{protocol}://{host}:{port}/swagger/
Default:
https://localhost:3000/swagger/
```

## Authors ✒️

* **Irene Cunto** - [contact](mailto:irene.cunto-baranda@siemens.com?subject=[GitLab]%20SCANIA%20gateway)
* **Juan Lajarín** - [contact](mailto:juan.lajarin_gonzalez@siemens.com?subject=[GitLab]%20SCANIA%20gateway)

***

## For more information about GitLab and how to contribute keep reading

### Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://code.siemens.com/gateways/scania/scania-gateway.git
git branch -M main
git push -uf origin main
```

### Integrate with your tools

- [ ] [Set up project integrations](https://code.siemens.com/gateways/scania/scania-gateway/-/settings/integrations)

### Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

### Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)