FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN yarn
CMD yarn start
EXPOSE 2369
