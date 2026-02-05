FROM node:18-alpine AS builder
 
# Set working directory
WORKDIR /app
 
# Copy package files
COPY package*.json ./
 
# Install all dependencies (including dev for testing)
RUN npm ci
 
# Copy source code
COPY . .
 
# Run tests
RUN npm test
 
# Stage 2: Production stage
FROM node:18-alpine
 
# Install curl for health checks
RUN apk add --no-cache curl
 
# Set working directory
WORKDIR /app
 
# Copy package files
COPY package*.json ./
 
# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force
 
# Copy application code
COPY src/ ./src/
 
# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app
 
# Switch to non-root user
USER nodejs
 
# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
 
# Expose port
EXPOSE 3000
 
# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1
 
# Start the application
CMD ["node", "src/app.js"]

