FROM openjdk
WORKDIR /usr/src/albedo
# COPY target/albedo-webapp-1.0-SNAPSHOT.jar .
COPY maven/ .

ENV spring.profiles.active=docker

CMD ["java", "-jar", "albedo-webapp-1.0-SNAPSHOT.jar"]