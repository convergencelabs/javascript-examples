FROM jekyll/jekyll:4.2.0 as builder

WORKDIR /srv/jekyll

COPY package.json .
COPY package-lock.json .
COPY _config.yml .
COPY Gemfile .
COPY Gemfile.lock .
COPY scripts scripts
COPY src src

RUN chown -R jekyll:jekyll /srv/jekyll

RUN /usr/jekyll/bin/entrypoint jekyll build

USER jekyll

RUN npm ci

RUN node scripts/copy-libs.js


FROM nginx:stable-alpine

# confd
RUN wget https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 && \
    mv confd-0.16.0-linux-amd64 /usr/local/bin/confd && \
    chmod +x /usr/local/bin/confd
ADD docker/confd /etc/confd/

# boot script
ADD docker/bin/boot.sh /boot.sh
RUN chmod +x /boot.sh

# nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /srv/jekyll/_site /usr/share/nginx/html

CMD ["/boot.sh"]