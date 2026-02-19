# Use Node 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY . .

# Install client dependencies and build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Go back to app root
WORKDIR /app

# Expose port
EXPOSE 5000

# Set environment variable for port
ENV PORT=5000

# Start the application
CMD ["npm", "start"]
