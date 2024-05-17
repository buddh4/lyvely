#!/bin/bash

while getopts fbu flag
do
    case "${flag}" in
        f) FILES=1;;
        b) BUILD=1;;
        u) USER=1;;
    esac
done

# Create data directories for MongoDB and Redis
mkdir -p data/mongo1 data/mongo2 data/mongo3 data/redis

if [ "$USER" = 1 ]
then
    # Create users for each service
    sudo useradd -u 957 --system -U mongodb || echo "User mongodb already exists."
    sudo useradd -u 959 --system -U redis || echo "User redis already exists."
    sudo useradd -u 961 --system -U lyvely || echo "User lyvely already exists."
    sudo useradd -u 958 --system -U nginx || echo "User nginx already exists."
fi

# Set appropriate permissions for data directories
sudo chown -R 957:957 data/mongo1 data/mongo2 data/mongo3
sudo chown -R redis:redis data/redis

# Load .env file
if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
  # Wee need to define those otherwise they get overwritten
  export proxy_add_x_forwarded_for='$proxy_add_x_forwarded_for'
  export remote_addr='$remote_addr'
  export host='$host'
  export request_uri='$request_uri'
  export uri='$uri'
  export scheme='$scheme'
  export remote_user='$remote_user'
  export time_local='$time_local'
  export status='$status'
  export request='$request'
  export body_bytes_sent='$body_bytes_sent'
  export http_referer='$http_referer'
  export http_user_agent='$http_user_agent'
  export http_x_forwarded_for='$http_x_forwarded_for'
fi

# Copy environment used for this setup and docker-compose
if [ ! -f .env ]
then
	cp .env.dist .env
fi

# Copy backend configuration
if [ ! -f config/lyvely.ts ] || [ "$FILES" = 1 ]
then
  export JWT_ACCESS_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'));")
  export JWT_REFRESH_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'));")
  export JWT_VERIFY_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'));")
	envsubst < lyvely.ts.dist > config/lyvely.ts
fi

# Copy nginx configuration
if [ ! -f config/nginx.conf ] || [ "$FILES" = 1 ]
then
	envsubst < nginx.conf.dist > config/nginx.conf
fi

# Copy web environment
if [ ! -f ../packages/web/.env ] || [ "$FILES" = 1 ]
then
	envsubst < web.env.dist > ../packages/web/.env
fi


if [ "$BUILD" = 1 ]; then
# Build the web static files which we need for our custom nginx image
  cd ..
  npm install && npx nx run-many -t build
fi


