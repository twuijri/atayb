#!/bin/bash

# Build and Push Docker Image Script
# Usage: ./build-and-push.sh [docker-hub-username]

set -e

DOCKER_USERNAME="${1:-twuijri}"
IMAGE_NAME="link-manager"
VERSION="latest"

echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME:$VERSION .

echo "🏷️  Tagging image for Docker Hub..."
docker tag $IMAGE_NAME:$VERSION $DOCKER_USERNAME/$IMAGE_NAME:$VERSION

echo "📤 Pushing to Docker Hub..."
echo "Please login to Docker Hub if not already logged in:"
docker login

docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION

echo "✅ Done! Image pushed to: $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo ""
echo "📋 Use this in your docker-compose.yml:"
echo "   image: $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
