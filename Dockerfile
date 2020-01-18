From node:alpine
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
CMD npm start
