FROM nginx:stable-alpine

# supervisord
RUN apk --no-cache add supervisor
COPY supervisord/supervisord.conf /etc/supervisord.conf

# confd
ADD bin/confd-0.11.0-linux-amd64 /usr/local/bin/confd
ADD confd /etc/confd/
RUN chmod +x /usr/local/bin/confd

# nginx
COPY src /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

ADD bin/boot.sh /boot.sh
RUN chmod +x /boot.sh

CMD ["/boot.sh"]