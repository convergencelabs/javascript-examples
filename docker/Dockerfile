FROM nginx:stable-alpine

# supervisord
RUN apk --no-cache add supervisor
COPY supervisord/supervisord.conf /etc/supervisord.conf

# confd
ADD bin/confd-0.11.0-linux-amd64 /usr/local/bin/confd
RUN chmod +x /usr/local/bin/confd
ADD confd /etc/confd/

ADD bin/boot.sh /boot.sh
RUN chmod +x /boot.sh

# This is the most dynamic piece so add this last to
# maximize layer caching.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY src /usr/share/nginx/html

CMD ["/boot.sh"]