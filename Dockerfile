FROM node:10
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb
RUN dpkg -i dumb-init_*.deb
RUN yarn

EXPOSE 3000

COPY src /app
WORKDIR /app
RUN 'yarn'


CMD [ "dumb-init", "yarn", "run", "start" ]