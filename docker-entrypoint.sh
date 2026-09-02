#!/bin/sh
set -eu
PORT="${PORT:-8080}"
sed "s/LISTEN_PORT/${PORT}/g" /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
