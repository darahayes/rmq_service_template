FROM node:6.9.1

RUN mkdir /service/

WORKDIR /service/

ADD . /service/

RUN npm install

CMD ["node", "index.js"]
