FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Lokka CLI globally
RUN npm i -g @lokka/cli

# Copy TypeScript config and guardrails
COPY tsconfig.json ./
COPY guardrails.yaml ./

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=3100

# Expose port
EXPOSE 3100

# Start application
CMD ["node", "dist/index.js"]

