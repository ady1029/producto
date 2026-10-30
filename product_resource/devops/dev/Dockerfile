FROM maven:3.5.2-jdk-8-alpine AS MAVEN_BUILD

ARG SCENARIO

COPY ./devops/dev/settings.xml /root/.m2/
COPY pom.xml /product-resource/
COPY src /product-resource/src/

WORKDIR /product-resource

RUN mvn package -P ${SCENARIO}