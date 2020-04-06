FROM ubuntu:16.04
RUN apt update
RUN apt upgrade -y
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt install -y nodejs
RUN apt install -y ffmpeg
RUN mkdir /musica
COPY . /musica
WORKDIR /musica

RUN npm install
RUN npm install @discordjs/opus
RUN npm start
