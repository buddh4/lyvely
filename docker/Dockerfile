# This dockerfile is used in combination with docker-compose and exports two stages a pwa and api stage.
FROM node:20 AS lyvely_build

RUN apt update \
 && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV MONGOMS_DISABLE_POSTINSTALL=1 \
    CYPRESS_INSTALL_BINARY=0

# Install common app dependencies
RUN npm install -g @microsoft/rush

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/common/temp/pnpm/store pnpm install --frozen-lockfile
RUN rush install

ENV NODE_ENV=production

# Copy config
COPY docker/config/lyvely.ts ./packages/applications/server/src/config/lyvely.production.config.ts
COPY docker/config/web.env ./packages/applications/pwa/.env

# Build
RUN rush build --to @lyvely/pwa --to @lyvely/server

# Deploy
RUN rush deploy --project @lyvely/server --target-folder ./prod/server --overwrite
RUN rush deploy --project @lyvely/pwa --target-folder ./prod/pwa --overwrite


# Now the nginx base comes into play
FROM nginx:1.27.0 AS pwa
ENV LYVELY_APP_ENV=production
COPY --from=lyvely_build /prod/pwa/packages/applications/pwa/dist/. /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/config/nginx.conf /etc/nginx/conf.d/

####
# API
####

FROM lyvely_build AS api
WORKDIR /usr/src/app/prod/server
# start the server
CMD  ["rushx", "start:prod"]
