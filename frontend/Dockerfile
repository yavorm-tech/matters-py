from node:18-bullseye-slim
RUN apt-get update && apt-get upgrade -y && apt-get install -y procps iproute2 vim supervisor
ENV APP_DIR="/opt/frontend"
COPY ./package.json $APP_DIR/package.json
COPY ./entrypoint.sh $APP_DIR/entrypoint.sh
COPY ./supervisord.conf /etc/supervisor/supervisord.conf
WORKDIR $APP_DIR
#RUN npm install -g pm2 
RUN npm install
RUN chmod +x entrypoint.sh
ENTRYPOINT ["$APP_DIR/entrypoint.sh"]
#CMD ["npm","run","dev"]
#entrypoint ["/opt/git-deploy-frontend/entrypoint.sh"]
