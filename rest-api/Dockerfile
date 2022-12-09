FROM node:16

# can provide args in docker run command, if not provided, set to defaults
# ARG ENVIRONMENT=local
# ARG PORT=3001

WORKDIR /app
RUN npm install -g typescript

COPY package.json /app
RUN npm install


COPY . /app

# set env variable, availible in code
# ENV PORT=${PORT}
# ENV ENVIRONMENT=${ENVIRONMENT}

# purely instructional purpose, must set port in docker run command
EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]