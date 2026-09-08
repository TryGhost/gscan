# ---- Base Node with Alpine ----
FROM node:24.20.0-alpine3.24@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf AS base
# Set working directory in the container
WORKDIR /app
# Copy package.json and lockfile to the workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Node's bundled corepack is too old to resolve pnpm 12's bin, so use the latest.
# The `pnpm --version` call warms corepack's download of the pinned pnpm version.
RUN npm install -g corepack@latest && corepack enable && pnpm --version

# ---- Dependencies ----
FROM base AS dependencies
# Install production dependencies
RUN pnpm install --ignore-scripts --prod --frozen-lockfile
# Copy only the production node_modules for later use
RUN cp -R node_modules prod_node_modules

# Install all dependencies, including 'devDependencies'
RUN pnpm install --ignore-scripts --frozen-lockfile

# ---- Release ----
FROM node:24.20.0-alpine3.24@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf AS release
# Set working directory
WORKDIR /app
# Copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# Copy your source code
COPY . .
# Link the config file (from any possible location)
RUN ln -s /config/config.json /app/config.development.json && \
    ln -s /config/config.json /app/config.test.json && \
    ln -s /config/config.json /app/config.staging.json && \
    ln -s /config/config.json /app/config.production.json

# Expose the port the app runs on
EXPOSE 2369

# Run your application (equivalent to `pnpm start`, without needing pnpm at runtime)
CMD ["node", "app/index.js"]
