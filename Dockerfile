FROM ccr.ccs.tencentyun.com/quqi/alinode:7.5.0-stretch

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
COPY ./ssh/docker_builder /root/.ssh/docker_builder
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free" >/etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free" >>/etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-backports main contrib non-free" >>/etc/apt/sources.list && \ 
    echo "deb https://security.debian.org/debian-security bullseye-security main contrib non-free" >>/etc/apt/sources.list

RUN apt-get update && apt-get install -y \
    python \
    python3-pip

RUN chmod 400 /root/.ssh/docker_builder && \
    bash -c 'echo -e "Host git.quqi.com\n\tStrictHostKeyChecking no\n\tIdentityFile /root/.ssh/docker_builder" >> /root/.ssh/config' && \
    GIT_SSH_COMMAND='ssh' npm i --production --registry=https://registry.npmmirror.com && \
    npm cache clean --force
COPY . /usr/src/app
CMD [ "npm", "run","start" ]

EXPOSE 7001
