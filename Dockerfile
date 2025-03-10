# Base Node.js image
FROM node:18-alpine
WORKDIR /app

# Install foundry and dependencies
RUN apk add --no-cache curl git && \
    curl -L https://foundry.paradigm.xyz | bash && \
    export PATH="$PATH:/root/.foundry/bin" && \
    foundryup

# Copy package files and install dependencies
COPY package*.json ./
COPY api/package*.json ./api/
COPY core/package*.json ./core/
RUN npm install && \
    cd api && npm install && cd .. && \
    cd core && npm install && cd ..

# Copy source code
COPY . .

# Build projects
RUN cd api && npm run build && cd .. && \
    cd core && npm run build && cd ..

# Create empty .env files for mounting
RUN touch /app/api/.env /app/core/.env /app/contracts/.env

# Expose ports
EXPOSE 3000 8080

# Start command
CMD ["npm", "start"]