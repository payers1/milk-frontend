FROM node:8.9 AS base
WORKDIR /var/www
COPY package.json .

FROM base AS dependencies
RUN yarn install
RUN cp -R node_modules prod_node_modules

FROM base AS build
COPY --from=dependencies /var/www/prod_node_modules ./node_modules
COPY . .
RUN yarn build

FROM nginx AS release
COPY default.conf /etc/nginx/conf.d/
COPY build_webpack /var/www/html
