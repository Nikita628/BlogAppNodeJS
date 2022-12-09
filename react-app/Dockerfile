FROM node:16

# ARG ENVIRONMENT=local
# ARG PORT=3000

WORKDIR /app

COPY package.json /app
RUN npm install


COPY . /app

# ENV PORT=${PORT}
# ENV ENVIRONMENT=${ENVIRONMENT}

EXPOSE ${PORT}

CMD [ "npm", "start" ]