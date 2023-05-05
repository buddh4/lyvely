#!/bin/bash

# Create data directories for MongoDB and Redis
mkdir -p data/mongo1 data/mongo2 data/mongo3 data/redis

# Create users for each service
useradd -u 1001 -m -d /home/lyvely -s /bin/bash -U lyvely || echo "User lyvely already exists."
useradd -u 1002 -m -d /home/mongo -s /bin/bash -U mongo || echo "User mongo already exists."
useradd -u 1003 -m -d /home/redis -s /bin/bash -U redis || echo "User redis already exists."
useradd -u 1004 -m -d /home/nginx -s /bin/bash -U nginx || echo "User nginx already exists."

# Set appropriate permissions for data directories
chown -R 1002:1002 data/mongo1 data/mongo2 data/mongo3
chown -R 1003:1003 data/redis

if [ ! -f ./nginx.conf ]
then
	envsubst < nginx.conf.dist > nginx.conf
fi

# Build the web static files which we need for our custom nginx image
cd ../
npm install
npm run common:build;
npm run web:build;


