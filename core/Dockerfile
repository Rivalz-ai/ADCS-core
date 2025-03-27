# Base image
FROM node:20-slim

# Working directory
WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy built files from builder stage
COPY . .

# Create logs directory
RUN mkdir -p logs && touch logs/adcs.log

# Install production dependencies only
RUN yarn install

# Build the application
RUN yarn build

# Copy the supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose necessary ports
EXPOSE 3000

# Set the entrypoint to supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]