#!/bin/sh

# Replace placeholders in the template with environment variables
envsubst < /usr/share/nginx/html/main.js > /usr/share/nginx/html/main.js.tmp

# Move the temporary file to the desired location
mv /usr/share/nginx/html/main.js.tmp /usr/share/nginx/html/main.js

# Start Nginx
exec "$@"
