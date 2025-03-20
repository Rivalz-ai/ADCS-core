# Base Node.js image
FROM node:20-slim
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
RUN yarn install && \
    cd api && yarn install && cd .. && \
    cd core && yarn install && cd ..

# Copy source code
COPY . .

# Build projects
RUN cd api && yarn build && cd .. && \
    cd core && yarn build && cd ..

# Set the entrypoint
ENTRYPOINT ["yarn", "start"]