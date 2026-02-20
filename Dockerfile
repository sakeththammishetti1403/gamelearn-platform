# Simple, reliable Dockerfile for Railway
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend code (excluding client for now)
COPY config ./config
COPY engine ./engine
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY socket ./socket
COPY utils ./utils
COPY services ./services
COPY seedCareer.js ./
COPY seeder.js ./
COPY server.js ./

# Build frontend
WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Verify build output
RUN ls -la /usr/src/app/client/dist || echo "dist folder not found!"

# Back to root
WORKDIR /usr/src/app

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "server.js"]
