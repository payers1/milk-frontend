FROM nginx
COPY default.conf /etc/nginx/conf.d/
COPY build_webpack /var/www/html
RUN apt-get update
RUN apt-get install certbot -y
