#!/bin/bash

# ============================================
# MyNet.tn - Deployment Script
# ============================================

set -e

ENVIRONMENT=${1:-production}

echo "🚀 Deploying MyNet.tn to $ENVIRONMENT..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Build applications
echo "📦 Building applications..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Docker deployment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🐳 Building Docker images..."
    docker-compose build
    
    echo "🐳 Starting containers..."
    docker-compose --profile production up -d
    
    echo -e "${GREEN}✅ Deployment completed!${NC}"
else
    echo "🐳 Starting development containers..."
    docker-compose up -d
    
    echo -e "${GREEN}✅ Development deployment completed!${NC}"
fi

