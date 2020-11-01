FROM openjdk
WORKDIR /usr/src/albedo
COPY albedo-webapp/target/albedo-webapp-1.0-SNAPSHOT.jar .

CMD ["java", "-jar", "albedo-webapp-1.0-SNAPSHOT.jar"]