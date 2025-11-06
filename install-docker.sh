#!/bin/bash

echo "======================================"
echo "Instagram Automation App - Docker Setup"
echo "======================================"
echo ""

read -p "Do you want to use default ports (Backend: 8000, Frontend: 3000)? (y/n): " use_default

if [ "$use_default" = "n" ] || [ "$use_default" = "N" ]; then
    read -p "Enter Backend Port [8000]: " backend_port
    read -p "Enter Frontend Port [3000]: " frontend_port
    backend_port=${backend_port:-8000}
    frontend_port=${frontend_port:-3000}
else
    backend_port=8000
    frontend_port=3000
fi

echo ""
echo "Creating .env file with your configuration..."

cat > .env <<EOL
BACKEND_PORT=$backend_port
FRONTEND_PORT=$frontend_port
DATABASE_URL=sqlite:///./automation.db
SECRET_KEY=instagram-automation-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
INSTAGRAM_TIMEOUT=60
ENV=production
DEBUG=False
EOL

echo "✅ .env file created successfully"
echo ""
echo "======================================"
echo "Configuration Summary:"
echo "Backend Port: $backend_port"
echo "Frontend Port: $frontend_port"
echo "======================================"
echo ""

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "🐳 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "======================================"
echo "✅ Installation completed successfully!"
echo "======================================"
echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://localhost:$frontend_port"
echo "   Backend API: http://localhost:$backend_port"
echo "   API Documentation: http://localhost:$backend_port/docs"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""
