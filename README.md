# Teammates Manager
[![Build Status](https://travis-ci.com/stefff94/teammates-manager.svg?branch=master)](https://travis-ci.com/stefff94/teammates-manager)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=it.polste.attsw%3Ateammates-manager&metric=alert_status)](https://sonarcloud.io/dashboard?id=it.polste.attsw%3Ateammates-manager)
[![codecov](https://codecov.io/gh/stefff94/teammates-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/stefff94/teammates-manager)

## Run all the tests
###### Note: you need a running Docker installation on your machine.
```
./mvnw clean verify -Pjacoco && ./mvnw verify -Pe2e-backend-tests && ./mvnw verify -Ptest-frontend
``` 

## Application screenshots
![Alt text](https://i.ibb.co/Vj2Dc4F/home.png "Home")
![Alt text](https://i.ibb.co/4RVdGD4/insert-teammate.png "Insert new teammate")
![Alt text](https://i.ibb.co/nq254NQ/teammate-list.png "Teammate list")