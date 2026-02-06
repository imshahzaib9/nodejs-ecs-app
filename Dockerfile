FROM node:18-alpine
 
# Set working directory
WORKDIR /app
 
# Copy package files
COPY package*.json ./
 
# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force
 
# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 3000 
# Start the application
CMD ["node", "src/app.js"]

