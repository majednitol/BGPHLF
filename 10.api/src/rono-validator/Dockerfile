FROM node:18-alpine

# Install openssl and bash
RUN apk add --no-cache openssl bash

WORKDIR /app

# Copy and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Make the signing script executable
RUN chmod +x ./sign-roa.sh

# Create the required folders in case volumes aren't mounted yet
RUN mkdir -p /data /app/keys

# Start the Node app in the background and sign ROA file every 10 minutes
CMD ["sh", "-c", "node index.js & while true; do sleep 600 && ./sign-roa.sh; done"]
