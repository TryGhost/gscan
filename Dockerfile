# ---- Base Node with Alpine ----
FROM node:22.13.1-alpine3.21 AS base
# Set working directory in the container
WORKDIR /app
# Copy package.json and yarn.lock files to the workspace
COPY package.json yarn.lock ./

# ---- Dependencies ----
FROM base AS dependencies
# Install production library dependencies
RUN yarn install --production --frozen-lockfile
# Copy only the production node_modules for later use
RUN cp -R node_modules prod_node_modules

# Install all library dependencies, including 'devDependencies'
RUN yarn install --frozen-lockfile

# Install app dependencies
RUN yarn install --cwd app/ --frozen-lockfile

# ---- Release ----
FROM node:22.13.1-alpine3.21 AS release
# Set working directory
WORKDIR /app
# Copy production library node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# Copy app node_modules
COPY --from=dependencies /app/app/node_modules ./app/node_modules
# Copy your source code
COPY . .
# Link the config file (from any possible location)
RUN ln -s /config/config.json /app/config.development.json && \
    ln -s /config/config.json /app/config.test.json && \
    ln -s /config/config.json /app/config.staging.json && \
    ln -s /config/config.json /app/config.production.json

# Expose the port the app runs on
EXPOSE 2369

# Run your application
CMD ["yarn", "start"]
