FROM node:19-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN yarn
CMD yarn start
EXPOSE 2369
