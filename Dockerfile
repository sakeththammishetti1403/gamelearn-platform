# Multi-stage build for production deployment
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY . .

# Copy built frontend from build stage
COPY --from=frontend-build /app/client/dist ./client/dist

# Expose port (use PORT env var for flexibility)
EXPOSE 5000
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
