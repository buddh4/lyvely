# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY packages/web/package*.json ./packages/web/
COPY packages/server/package*.json ./packages/server/
COPY packages/common/package*.json ./packages/common/
COPY docker/lyvely.ts.dist ./packages/server/config/lyvely.ts
COPY docker/web.env.dist ./package/web/.env

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run common:build
RUN npm run server:build
RUN npm run web:build

EXPOSE 8080

# Start the server using the production build
CMD "npm run server:prod"
