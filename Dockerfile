FROM node

RUN yarn

EXPOSE 3000

COPY src /app
WORKDIR /app
RUN 'yarn'