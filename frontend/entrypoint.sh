#!/bin/bash
#pm2 init
cd $APP_DIR
mkdir -p /var/log/frontend
npm install
#pm2-runtime  start process.yml
exec "$@"
