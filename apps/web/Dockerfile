# ---- Base Node with Alpine ----
FROM node:24.11.1-alpine3.21 AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
# Copy workspace config and lockfile
COPY pnpm-workspace.yaml pnpm-lock.yaml .npmrc package.json ./
# Copy package manifests for all workspace packages
COPY packages/gscan/package.json packages/gscan/package.json
COPY apps/web/package.json apps/web/package.json

# ---- Dependencies ----
FROM base AS dependencies
RUN pnpm install --frozen-lockfile --prod

# ---- Release ----
FROM node:24.11.1-alpine3.21 AS release
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY --from=dependencies /app ./
# Copy source code
COPY packages/gscan/lib packages/gscan/lib
COPY packages/gscan/bin packages/gscan/bin
COPY apps/web/ apps/web/
# Link the config file (for @tryghost/config)
RUN ln -s /config/config.json /app/apps/web/config.development.json && \
    ln -s /config/config.json /app/apps/web/config.test.json && \
    ln -s /config/config.json /app/apps/web/config.staging.json && \
    ln -s /config/config.json /app/apps/web/config.production.json

EXPOSE 2369

WORKDIR /app/apps/web
CMD ["pnpm", "start"]
