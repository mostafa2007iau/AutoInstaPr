#!/bin/bash

echo "======================================"
echo "Instagram Automation App - venv Setup"
echo "======================================"
echo ""

read -p "Do you want to use default port (8000)? (y/n): " use_default

if [ "$use_default" = "n" ] || [ "$use_default" = "N" ]; then
    read -p "Enter Backend Port [8000]: " backend_port
    backend_port=${backend_port:-8000}
else
    backend_port=8000
fi

echo ""
echo "Creating virtual environment..."

# Create venv
python3 -m venv venv

# Activate venv
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Virtual environment created and activated"
else
    echo "❌ Failed to create virtual environment"
    exit 1
fi

echo ""
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "Creating .env file..."

cat > .env <<EOL
BACKEND_PORT=$backend_port
FRONTEND_PORT=3000
DATABASE_URL=sqlite:///./automation.db
SECRET_KEY=instagram-automation-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
INSTAGRAM_TIMEOUT=60
ENV=development
DEBUG=True
EOL

echo "✅ .env file created successfully"
echo ""
echo "======================================"
echo "Configuration Summary:"
echo "Backend Port: $backend_port"
echo "======================================"
echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "🚀 To start the backend server, run:"
echo "   source venv/bin/activate  (if not already activated)"
echo "   python main.py"
echo ""
echo "🌐 Your API will be available at:"
echo "   http://localhost:$backend_port"
echo "   API Documentation: http://localhost:$backend_port/docs"
echo ""
