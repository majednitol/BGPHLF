FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install


COPY index.js .


CMD ["npx", "nodemon", "index.js"]
