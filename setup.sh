#!/bin/bash

# Setup script for Utils.Bot
# This script helps set up the development environment

set -e

echo "🎫 Utils.Bot Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed and running."
else
    echo "✅ PostgreSQL client detected"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "🗄️  Setting up Database..."
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example"
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration before continuing"
    read -p "Press Enter when ready to continue..."
fi

echo "Generating Prisma Client..."
npm run prisma:generate

echo "Pushing database schema..."
npm run prisma:push || echo "⚠️  Database push failed. Please check your DATABASE_URL in .env"

cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found. Copying from .env.example"
    cp .env.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your configuration"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Configure backend/.env with your Discord bot token and database URL"
echo "2. Configure frontend/.env.local with your API URL and Guild ID"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo "5. Access the dashboard at http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "- Main README: ./README.md"
echo "- Backend README: ./backend/README.md"
echo "- Frontend README: ./frontend/README.md"
echo ""
echo "🐳 Docker Alternative:"
echo "1. Copy .env.example to .env and configure it"
echo "2. Run: docker-compose up -d"
echo ""
echo "Happy coding! 🚀"
