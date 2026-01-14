#!/bin/sh

# Create data directory if it doesn't exist
mkdir -p /app/data

# Create config.json if it doesn't exist
if [ ! -f /app/data/config.json ]; then
  echo '{"adminUsername":"admin","adminPassword":"password"}' > /app/data/config.json
fi

# Create links.json if it doesn't exist
if [ ! -f /app/data/links.json ]; then
  echo '[]' > /app/data/links.json
fi

# Create stats.json if it doesn't exist
if [ ! -f /app/data/stats.json ]; then
  echo '{"page_views":0,"link_clicks":0}' > /app/data/stats.json
fi

# Start the application
exec node server.js
