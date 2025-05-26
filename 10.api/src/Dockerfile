# Use a modern LTS version of Node.js
FROM node:18

WORKDIR /usr/src/app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "app.js"]
