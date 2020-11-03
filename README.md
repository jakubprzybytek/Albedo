# Albedo
"draft of a beta version" - don't expect anything ;)

## Installation
Download following resources and save on local disk:
* https://www.minorplanetcenter.net/iau/MPCORB/MPCORB.DAT
* ftp://ssd.jpl.nasa.gov/pub/eph/planets/ascii/de438/header.438
* ftp://ssd.jpl.nasa.gov/pub/eph/planets/ascii/de438/ascp01950.438
* NGC.csv from https://github.com/mattiaverga/OpenNGC

Update `application.properties` accordingly.

## Quick Run
In albedo-webapp folder:

`mvn spring-boot:run`

Hit http://localhost:8080/

## Develop

#### Backend

In `albedo-webapp` module:
Run `jp.albedo.webapp.AlbedoApplication` in IDE with `-Dserver.port=8090` as VM params.

#### Frontend

`npm run start`

Unit tests:
`npm run test:watch`

## Release

`mvn package`

### Run

`%JAVA_HOME%\bin\java -jar target\albedo-webapp-1.0-SNAPSHOT.jar`

## Deploying to Docker

### Build main container

In`albedo-webapp/`:

`mvn clean package docker:build`

Also:
`docker build --tag albedo:1.0 .`

### Build data volume

```
docker container create --name volumeSetup -v albedo-data:/usr/data busybox
docker run --rm -i -v=albedo-data:/usr/data busybox mkdir /usr/data/mpc
docker cp ./misc/mpc/MPCORB.DAT volumeSetup:/usr/data/mpc
docker cp ./misc/mpc/CometEls.txt volumeSetup:/usr/data/mpc
docker run --rm -i -v=albedo-data:/usr/data busybox mkdir /usr/data/de438
docker cp ./misc/de438/header.438 volumeSetup:/usr/data/de438
docker cp ./misc/de438/ascp01950.438 volumeSetup:/usr/data/de438
docker run --rm -i -v=albedo-data:/usr/data busybox mkdir /usr/data/OpenNGC
docker cp ./misc/OpenNGC/NGC.csv volumeSetup:/usr/data/OpenNGC
docker cp ./misc/OpenNGC/addendum/addendum.csv volumeSetup:/usr/data/OpenNGC
docker rm volumeSetup
```

List content of the volume:
```
docker run --rm -i -v=albedo-data:/usr/data busybox ls /usr/data
```

### Run

`docker run --publish 8000:8080 --detach --name albedo -v=albedo-data:/usr/data jp/albedo`
