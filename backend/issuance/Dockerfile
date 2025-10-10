# Use Node.js as the base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies and tsx globally
RUN npm install && npm install -g tsx

# Copy source code
COPY . .

# Expose port 8080 instead of 3000
EXPOSE 8080

# Set environment variables from .env file at runtime
ENV NODE_ENV=production
ENV PORT=8080

# Run the application directly with tsx
CMD ["tsx", "index.ts"]
