FROM node:16

WORKDIR /app
RUN npm install -g typescript

COPY package.json /app
RUN npm install


COPY . /app


EXPOSE 3001

CMD [ "npm", "run", "start" ]