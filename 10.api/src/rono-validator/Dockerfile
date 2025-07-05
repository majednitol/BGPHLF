FROM node:18-alpine

RUN apk add --no-cache openssl bash jq

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN chmod +x ./sign-roa.sh
# RUN mkdir -p /app/data /app/data/keys
CMD ["sh", "-c", "node index.js & ./sign-roa.sh && while true; do sleep 600 && ./sign-roa.sh; done"]
