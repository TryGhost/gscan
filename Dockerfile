FROM node:10-alpine

ENV NODE_ENV development

# Set port to run application on
ENV port 2369

# Create a non-root user to run as
ENV user app
ENV uid 1001

RUN addgroup -g $uid -S $user && adduser -u $uid -S -G $user $user \
    && mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app

# Run tests at build time and make sure we clean up unused packages and caches
RUN yarn install && yarn test \
    && yarn install --production && yarn cache clean \
    && chown -R $user:$user /usr/src/app && rm -rf config.*.json

USER $user
EXPOSE $port

CMD yarn start
