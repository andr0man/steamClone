FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN cp .env.release .env

RUN npm run build

RUN npm install -g serve
CMD [ "serve", "-s", "dist" ]

EXPOSE 3000
