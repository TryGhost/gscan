# ---- Base Node with Alpine ----
FROM node:24.21.0-alpine3.24@sha256:be80f76cf40ec8e42b9bec49f60a55e0660f30af58d3e5a25530785b30ea67e2 AS base
# Set working directory in the container
WORKDIR /src
# Node's bundled corepack is too old to resolve pnpm 12's bin, so use the latest.
# The `pnpm --version` call warms corepack's download of the pinned pnpm version.
RUN npm install -g corepack@latest && corepack enable && pnpm --version

# ---- Bundle ----
FROM base AS bundle
# The workspace manifests and lockfile drive dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# `pnpm deploy` copies gscan into the bundle as real files rather than linking
# out to the monorepo, so the library sources must be present, not just its
# manifest.
COPY packages/gscan ./packages/gscan
COPY apps/web ./apps/web
# Produces a standalone /out: apps/web's own files plus a node_modules holding
# only its production dependencies (gscan included). No pnpm needed at runtime.
RUN pnpm --filter=@tryghost/gscan-web deploy --prod --frozen-lockfile --ignore-scripts /out

# ---- Release ----
FROM node:24.21.0-alpine3.24@sha256:be80f76cf40ec8e42b9bec49f60a55e0660f30af58d3e5a25530785b30ea67e2 AS release
# Set working directory
WORKDIR /app
# Copy the self-contained web app bundle
COPY --from=bundle /out ./
# Link the config file (from any possible location)
RUN ln -s /config/config.json /app/config.development.json && \
    ln -s /config/config.json /app/config.test.json && \
    ln -s /config/config.json /app/config.staging.json && \
    ln -s /config/config.json /app/config.production.json

# Expose the port the app runs on
EXPOSE 2369

# Run your application (equivalent to `pnpm start`, without needing pnpm at runtime)
CMD ["node", "index.js"]
