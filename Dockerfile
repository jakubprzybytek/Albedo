FROM openjdk
WORKDIR /usr/src/albedo
COPY albedo-webapp/target/albedo-webapp-1.0-SNAPSHOT.jar .

WORKDIR /usr/data/albedo
COPY ../misc/mpc/MPCORB.DAT .
COPY ../misc/mpc/CometEls.txt .

COPY ../misc/de438/header.438 .
COPY ../misc/de438/ascp01950.438 .

COPY ../misc/OpenNGC/NGC.csv .
COPY ../misc/OpenNGC/addendum/addendum.csv .


CMD ["java", "-jar", "albedo-webapp-1.0-SNAPSHOT.jar"]