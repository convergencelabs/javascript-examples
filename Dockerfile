FROM jekyll/jekyll:4.2.0 as jekyll

WORKDIR /srv/jekyll

COPY _config.yml .
COPY Gemfile .
COPY Gemfile.lock .
COPY src src

RUN chown -R jekyll:jekyll /srv/jekyll

RUN /usr/jekyll/bin/entrypoint jekyll build --disable-disk-cache

FROM node:16 as node

RUN mkdir /tmp/examples

WORKDIR /tmp/examples

COPY package.json .
COPY package-lock.json .
COPY scripts scripts

RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/

RUN npm ci
RUN node scripts/copy-libs.js

FROM nginx:stable-alpine

# confd
RUN wget -nv https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 && \
    mv confd-0.16.0-linux-amd64 /usr/local/bin/confd && \
    chmod +x /usr/local/bin/confd
COPY docker/confd /etc/confd/

# boot script
COPY docker/bin/boot.sh /boot.sh
RUN chmod +x /boot.sh

# nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=jekyll /srv/jekyll/_site /usr/share/nginx/html
COPY --from=node /tmp/examples/_site/libs /usr/share/nginx/html/libs

CMD ["/boot.sh"]