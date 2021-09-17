FROM node:latest

WORKDIR /app

COPY . /app
RUN npm install -g cnpm
RUN cnpm install --unsafe-perm=true --allow-root

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]
