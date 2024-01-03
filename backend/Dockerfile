FROM debian:12.2 as python-runtime 
#stage 1 - install python 
RUN apt-get update && apt-get upgrade -y 
RUN apt-get install python3 python3-venv python3-pip -y
RUN python3 -m venv /opt/venv
ENV VIRTUAL_ENV=/opt/venv/bin
ENV PATH=$VIRTUAL_ENV:$PATH
ENV FLASK_APP=app
ENV APP_DIR="/opt/backend"
RUN mkdir $APP_DIR 
COPY ./requirements.txt $APP_DIR
WORKDIR $APP_DIR
RUN pip install -r requirements.txt

#stage 2 - install docker 
FROM debian:12.2 as docker-build 
RUN apt-get update && apt-get upgrade -y && apt-get install curl apt-transport-https ca-certificates gnupg curl -y 
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update && apt-get install -y docker-ce

#stage 3 - build the image 
FROM debian:12.2 as main-image
COPY --from=python-runtime /opt/venv /opt/venv
COPY --from=docker-build /usr/bin/docker /usr/bin/docker
COPY --from=docker-build /usr/libexec/docker/cli-plugins/docker-buildx /usr/libexec/docker/cli-plugins/docker-buildx
RUN apt-get update && apt-get upgrade -y && apt-get install -y iproute2 procps vim git supervisor 
ENV VIRTUAL_ENV="/opt/venv/bin"
ENV PATH="$VIRTUAL_ENV:$PATH"
ENV FLASK_APP=app
ENV GIT_PYTHON_GIT_EXECUTABLE=/usr/bin/git
COPY ./supervisord.conf /etc/supervisor/supervisord.conf
RUN mkdir $APP_DIR
COPY ./entrypoint.sh $APP_DIR
WORKDIR $APP_DIR
RUN groupadd -g 999 celery && useradd -u 999 --create-home --home-dir /app -g celery -s /bin/bash celery
WORKDIR $APP_DIR
RUN chmod +x $APP_DIR/entrypoint.sh
RUN chown -R celery:celery $APP_DIR
EXPOSE 8086
ENTRYPOINT ["$APP_DIR/entrypoint.sh"]
#CMD ["flask", "run", "--host","0.0.0.0", "--port","8086"]
