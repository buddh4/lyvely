#!/bin/bash

while getopts fbu flag
do
    case "${flag}" in
        f) FILES=1;;
        b) BUILD=1;;
        u) USER=1;;
    esac
done

SCRIPT_DIR=$(dirname "$0")
LYVELY_ROOT=$(dirname "$SCRIPT_DIR")

# Create data directories for MongoDB and Redis
mkdir -p "$SCRIPT_DIR/data/mongo1" "$SCRIPT_DIR/data/mongo2" "$SCRIPT_DIR/data/mongo3" "$SCRIPT_DIR/data/redis"

if [ "$USER" = 1 ]
then
    # Create users for each service
    sudo useradd -u 957 --system -U -s /usr/sbin/nologin mongodb || echo "User mongodb already exists."
    sudo useradd -u 959 --system -U -s /usr/sbin/nologin redis || echo "User redis already exists."
    sudo useradd -u 961 --system -U -s /usr/sbin/nologin lyvely || echo "User lyvely already exists."
    sudo useradd -u 958 --system -U -s /usr/sbin/nologin nginx || echo "User nginx already exists."
fi

# Set appropriate permissions for data directories
sudo chown -R 957:957 "$SCRIPT_DIR/data/mongo1" "$SCRIPT_DIR/data/mongo2" "$SCRIPT_DIR/data/mongo3"
sudo chown -R redis:redis "$SCRIPT_DIR/data/redis"

# Copy environment used for this setup and docker-compose
if [ ! -f "$SCRIPT_DIR/.env" ]
then
	cp "$SCRIPT_DIR/.env.dist" "$SCRIPT_DIR/.env"
fi

# Load .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(echo $(cat "$SCRIPT_DIR/.env" | sed 's/#.*//g'| xargs) | envsubst)
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


# Copy nginx configuration
if [ ! -d "$SCRIPT_DIR/config" ] && [ "$FILES" = 1 ]
then
	mkdir "$SCRIPT_DIR/config"
fi

# Copy backend configuration
if [ ! -f "$SCRIPT_DIR/config/lyvely.ts" ] || [ "$FILES" = 1 ]
then
  export JWT_ACCESS_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'));")
  export JWT_REFRESH_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'));")
  export JWT_VERIFY_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'));")
	envsubst < "$SCRIPT_DIR/lyvely.ts.dist" > "$SCRIPT_DIR/config/lyvely.ts"
fi

if [ ! -f "$SCRIPT_DIR/docker-compose.yml" ] || [ "$FILES" = 1 ]
then
	envsubst < "$SCRIPT_DIR/docker-compose.yml.dist" > "$SCRIPT_DIR/docker-compose.yml"
fi

# Copy nginx configuration
if [ ! -f "$SCRIPT_DIR/config/nginx.conf" ] || [ "$FILES" = 1 ]
then
	envsubst < "$SCRIPT_DIR/nginx.conf.dist" > "$SCRIPT_DIR/config/nxginx.conf"
fi

if [ ! -f "$SCRIPT_DIR/config/pwa.conf" ] || [ "$FILES" = 1 ]
then
	envsubst < "$SCRIPT_DIR/pwa.conf.dist" > "$SCRIPT_DIR/config/pwa.conf"
fi

if [ ! -f "$SCRIPT_DIR/config/docs.conf" ] || [ "$FILES" = 1 ]
then
	envsubst < "$SCRIPT_DIR/docs.conf.dist" > "$SCRIPT_DIR/config/docs.conf"
fi

# Copy web environment
if [ ! -f "$SCRIPT_DIR/config/web.env" ] || [ "$FILES" = 1 ]
then
	envsubst < "$SCRIPT_DIR/web.env.dist" > "$SCRIPT_DIR/config/web.env"
fi


if [ "$BUILD" = 1 ]; then
# Build the web static files which we need for our custom nginx image
  cd "$LYVELY_ROOT"
  pnpm install --frozen-lockfile && pnpm nx run-many -t build --all --exclude=@lyvely/docs
fi


