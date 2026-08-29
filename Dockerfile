FROM nginx:1.27-alpine
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
  && rm -f /etc/nginx/conf.d/default.conf
COPY index.html styles.css script.js favicon.svg /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
