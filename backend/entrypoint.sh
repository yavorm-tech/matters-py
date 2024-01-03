#!/bin/bash
#/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
#cp -r /opt/backend-git-deploy/ssh /app/.ssh
#chmod 0400 /app/.ssh/id_rsa
#chown -R celery:celery /app
#ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
#pm2-runtime init
cd /opt/backend-git-deploy && mkdir log
docker buildx create --name git-deploy && docker buildx use git-deploy
#pm2-runtime process.yml
#pm2 start --name flask "celery -A celery_worker.celery worker --loglevel=info"
#pm2 start --name celery "flask run --host 0.0.0.0 --port 8086 --debug"
exec  "$@"
