# Railway-optimized Dockerfile
FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source
COPY config ./config
COPY engine ./engine
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY socket ./socket
COPY utils ./utils
COPY services ./services
COPY seedCareer.js seeder.js server.js ./

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci && npm cache clean --force
COPY client/ ./
RUN npm run build

# Back to app root
WORKDIR /app

# Railway will set PORT automatically
EXPOSE 8080

CMD ["node", "server.js"]
