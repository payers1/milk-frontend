FROM nginx
COPY default.conf /etc/nginx/conf.d/
COPY build_webpack /var/www/html
