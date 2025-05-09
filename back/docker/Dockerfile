FROM node:22.4.1-slim

# Set the user to root to install packages
USER root

# Install system dependencies including R, pandoc, and build essentials for R packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    net-tools \
    lsof \
    r-base \
    r-base-dev \
    pandoc \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    texlive \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-lang-french \
    lmodern && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install R packages jsonlite and rmarkdown
RUN R -e "install.packages(c('jsonlite', 'rmarkdown'), repos='http://cran.rstudio.com/')"

# Switch back to non-root user
# USER node

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
