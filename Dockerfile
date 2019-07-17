# The instructions for the first stage
FROM node:10.16.0-alpine as first-stage

WORKDIR /app

COPY yarn.lock ./
COPY package.json ./

ENV PATH ./node_modules/.bin:$PATH

RUN yarn

COPY . .

RUN yarn build

# The instructions for the second stage
FROM node:10.16.0-jessie-slim

WORKDIR /app

COPY --from=first-stage /app ./

EXPOSE 6002

CMD ["yarn", "start"]
