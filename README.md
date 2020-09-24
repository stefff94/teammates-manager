# Teammates Manager
[![Build Status](https://travis-ci.com/stefff94/teammates-manager.svg?branch=master)](https://travis-ci.com/stefff94/teammates-manager)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=it.polste.attsw%3Ateammates-manager&metric=alert_status)](https://sonarcloud.io/dashboard?id=it.polste.attsw%3Ateammates-manager)
[![codecov](https://codecov.io/gh/stefff94/teammates-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/stefff94/teammates-manager)

## Live Application on Heroku
<p align="center">
          <a href="https://teammates-manager.herokuapp.com">Teammates Manager</a>
</p>

## System Requirements
- Java 8(or higher)
- Docker

## Maven Profiles
` jacoco `: This profile configures the plugins required for unit and mutations tests: Maven Surefire to execute JUnit tests, PITest to execute mutation tests and JaCoCo to collect code coverage of the backend. 

` e2e-backend-tests `: This profiles configures Spring Boot and Maven Failsafe for E2E tests, starting the backend, running E2E-ending tests classes and then cleaning up safely after tests are completed.  

` test-frontend `: This profile enables the testing of the frontend by configuring the frontend-maven-plugin that enables binding npm-based commands to specific maven phases. More specifically, the plugin takes care of installing node and npm. Then, in the generate-resources phase, it runs `npm install`, to download all the necessary packages, and `npm run build`, to build the application. During the test phase, it runs the unit and integration tests, and finally, in the integration-test phase,it runs the e2e tests for the whole application. 

` build-frontend `:This profile configures the frontend-maven-plugin in order to produce a locally-runnable version of the frontend, with the backend IP set to `http://localhost:8080`. This profile should be used only to run the application locally and not while deploying on heroku.  

## Run all the tests
###### Note: you need a running Docker installation on your machine.
```
./mvnw clean verify -Pjacoco && ./mvnw verify -Pe2e-backend-tests && ./mvnw verify -Ptest-frontend
``` 

## Run application locally
###### Note: you need a running Docker installation on your machine.
```
sh run_locally.sh
``` 
This script let you create the docker container for the database, and run the application. 
If the docker container is already running, it simply detects the container ip and port, ad use these parameters 
to setting up the application datasource.url property. After exiting, the docker container will be removed.


## How to use
The application has been built to provide a tool to handle and organize teams in a work environment.
It offers CRUD functionalities to manage teammates, which can be created, retrieved, updated and deleted.
When opening the application, the main page is displayed:

![Alt text](https://i.ibb.co/Vj2Dc4F/home.png "Home")

Here the user can both see the existing teammates as well as use the form, located in the upper part of the screen,
to add a new one. To do so, the form has to be filled with the teammates's personal data and his/her skills can be
added to the multiselect bar. Such component offers both the possibility of adding new skills as well as selecting 
existing ones.

![Alt text](https://i.ibb.co/4RVdGD4/insert-teammate.png "Insert new teammate")

After completing the form, pressing "Submit" saves the teammate and displays a new Card in the lower part of the screen,
with the data of the new component of the team. 
From this card it is possible to both modify the teammate or delete it.
To get access to these functionalities, hover on the card with the mouse. Doing so will show the back of the card,
containing two icons. 
The "Pen" icon enables the change of the teammate and, by pressing it, the form is populated with the teammates's data,
enabling their modification. After applying the intended changes, the new data can be saved by pressing "Submit".

![Alt text](https://i.ibb.co/nq254NQ/teammate-list.png "Teammate list")

The "Bin" icon allows the deletion of the teammate. By pressing it, the teammate's card will disappear from the list 
and his/her data will be lost. When deleting all the teammates with a certain skill, such skill will also be removed 
from the multiselect component, avoiding in this way cluttering the Multiselect component with unused skills.
