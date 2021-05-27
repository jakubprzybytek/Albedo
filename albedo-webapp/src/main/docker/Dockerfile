FROM openjdk
WORKDIR /usr/src/albedo
COPY albedo-webapp/target/albedo-webapp-1.0-SNAPSHOT.jar .
# Use with maven docker plugin
# COPY maven/ .

ENV spring.profiles.active=docker

CMD ["java", "-jar", "albedo-webapp-1.0-SNAPSHOT.jar"]