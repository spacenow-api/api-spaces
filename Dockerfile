# The instructions for the first stage
FROM node:10.16.0-alpine as first-stage

WORKDIR /app

COPY yarn.lock ./
COPY package.json ./

ENV PATH ./node_modules/.bin:$PATH

RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++ 

RUN apk add --update --no-cache vips-dev fftw-dev build-base \
  --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/ \
  --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/main/

RUN yarn

RUN apk del .gyp

COPY . .

RUN yarn build

EXPOSE 6002

ENV NODE_ENV "production"

CMD ["yarn", "prod"]