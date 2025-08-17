FROM mirrors.aliyun.com/alinode:7.5.0

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/

RUN chmod 400 /root/.ssh/docker_builder && \
    GIT_SSH_COMMAND='ssh' npm i --production --registry=https://registry.npmmirror.com && \
    npm cache clean --force
COPY . /usr/src/app
CMD [ "npm", "run","start" ]

EXPOSE 7001
