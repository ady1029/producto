### STAGE 1: Build ###
FROM node:12.10.0-alpine as product-resource-ui-build

ENV http_proxy http://192.168.205.251:3128
ENV https_proxy http://192.168.205.251:3128

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:1.19.8-alpine

ENV http_proxy=http://192.168.205.251:3128
ENV https_proxy=http://192.168.205.251:3128

RUN rm -rf /usr/share/nginx/html/*

RUN apk add --no-cache bash

COPY ./devops/dev/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=product-resource-ui-build /app/build/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]