# Simple, reliable Dockerfile for Railway
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend code
COPY . .

# Install and build frontend
WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Back to root
WORKDIR /usr/src/app

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "server.js"]
