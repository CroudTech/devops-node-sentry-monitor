FROM node:10

RUN yarn

EXPOSE 3000

COPY src /app
WORKDIR /app
RUN 'yarn'