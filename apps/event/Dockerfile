FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy source code
COPY apps/event ./apps/event
COPY libs/common ./libs/common

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3002

# Start the service
CMD ["node", "dist/apps/event/main.js"] 