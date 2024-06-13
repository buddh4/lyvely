# This dockerfile is used in combination with docker-compose and exports two stages a pwa and api stage.
FROM node:20 AS lyvely_build

RUN apt update \
 && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV MONGOMS_DISABLE_POSTINSTALL=1 \
    CYPRESS_INSTALL_BINARY=0

# Install common app dependencies
RUN npm install -g @microsoft/rush

# We copy the directories manually so we can skip the build when changing config
COPY ./packages /usr/src/app/packages
COPY ./common /usr/src/app/common
COPY ./package.json /usr/src/app/package.json
COPY ./pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
COPY ./rush.json /usr/src/app/rush.json

WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/common/temp/pnpm/store rush install

ENV NODE_ENV=production

# Copy config
COPY docker/config/lyvely.ts ./packages/applications/server/src/config/lyvely.production.config.ts
COPY docker/config/web.env ./packages/applications/pwa/.env

# Build
RUN rush build --to @lyvely/pwa --to @lyvely/server --to @lyvely/docs

# Deploy
RUN rush deploy --project @lyvely/server --target-folder ./prod/server --overwrite
RUN rush deploy --project @lyvely/pwa --target-folder ./prod/pwa --overwrite
RUN rush deploy --project @lyvely/docs --target-folder ./prod/docs --overwrite


# Now the nginx base comes into play
FROM nginx:1.27.0 AS pwa
ENV LYVELY_APP_ENV=production
COPY --from=lyvely_build /usr/src/app/prod/pwa/packages/applications/pwa/dist/. /usr/share/nginx/html/pwa
COPY --from=lyvely_build /usr/src/app/prod/docs/packages/applications/docs/build/. /usr/share/nginx/html/docs
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY docker/config/nginx.conf /etc/nginx/conf.d/
COPY docker/config/pwa.conf /etc/nginx/sites-available/
COPY docker/config/docs.conf /etc/nginx/sites-available/

# Define the arg for optional docs config
ARG ENABLE_DOCS

# Create simlinks for pwa.conf and docs.conf in sites-enabled
RUN ln -s /etc/nginx/sites-available/pwa.conf /etc/nginx/sites-enabled/
RUN if [ "$ENABLE_DOCS" = "true" ] ; then ln -s /etc/nginx/sites-available/docs.conf /etc/nginx/sites-enabled/ ; fi

####
# API
####

FROM lyvely_build AS api
WORKDIR /usr/src/app/prod/server/packages/applications/server
# start the server
CMD  ["rushx", "start:prod"]
