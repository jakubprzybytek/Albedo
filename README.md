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
`mvn mvn spring-boot:run`

Hit http://localhost:8080/

## Develop

#### Backend

Run `jp.albedo.webapp.AlbedoApplication` in IDE with `-Dserver.port=8090` as VM params.

#### Frontend

`npm run start`