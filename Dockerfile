# Use official Node.js LTS version
FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files for backend
COPY package*.json ./

# Install backend dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy all backend source files
COPY config ./config
COPY engine ./engine
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY socket ./socket
COPY utils ./utils
COPY seedCareer.js ./
COPY seeder.js ./
COPY server.js ./

# Build frontend
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install ALL client dependencies (including devDependencies for build)
RUN npm install && npm cache clean --force

# Copy client source
COPY client ./

# Build the frontend
RUN npm run build

# Remove node_modules to save space (keep only dist)
RUN rm -rf node_modules

# Go back to app root
WORKDIR /app

# Create a simple healthcheck script
RUN echo '#!/bin/sh\nwget --no-verbose --tries=1 --spider http://localhost:${PORT:-5000}/health || exit 1' > /healthcheck.sh && chmod +x /healthcheck.sh

# Expose port (Railway will set PORT env var)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD /healthcheck.sh

# Start the server
CMD ["node", "server.js"]
