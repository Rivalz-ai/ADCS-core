# Base image
FROM node:20-slim

# Working directory
WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl git \
    && rm -rf /var/lib/apt/lists/*

# Copy built files from builder stage
COPY . .

# Install production dependencies only
RUN yarn install

# Generate Prisma client
RUN npx prisma generate

RUN yarn build

# Set the entrypoint
ENTRYPOINT ["yarn", "start"]
