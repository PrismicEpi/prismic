FROM node:22.4.1-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y curl net-tools lsof && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN npm install -g corepack@latest

WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies)
RUN pnpm install

# Copy source
COPY . .

# Don't copy source code - it will be mounted as a volume
# This allows for hot-reloading

EXPOSE 3000

# Start Tor service when the container starts
# CMD ["pnpm", "dev"]
CMD ["pnpm", "dev"]
