FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk update && apk add --no-cache sqlite sqlite-dev

CMD ["npm", "run", "start:dev"]
