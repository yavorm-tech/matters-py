#!/bin/bash
#pm2 init
cd /opt/git-deploy-frontend
mkdir /opt/git-deploy-frontend/log
npm install
#pm2-runtime  start process.yml
exec "$@"
