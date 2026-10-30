### STAGE 1: Build ###
FROM node:12.10.0-alpine as build

ENV http_proxy http://192.168.205.251:3128
ENV https_proxy http://192.168.205.251:3128

WORKDIR /product_resource

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:1.19.8-alpine
COPY ./devops/prod/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /product_resource/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]