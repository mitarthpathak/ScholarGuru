#!/bin/bash

echo "🚀 Starting AI Chatbot Setup..."

# Check if .env has real API key
if grep -q "gsk_your_actual_api_key_here" .env; then
    echo "❌ ERROR: Please update .env file with your real Groq API key"
    echo "📝 Steps:"
    echo "1. Go to https://console.groq.com/"
    echo "2. Sign up and get your API key"
    echo "3. Update .env file: GROQ_API_KEY=gsk_your_real_key_here"
    echo ""
    echo "⚠️  Continuing setup, but API calls will fail until key is configured"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install express cors dotenv node-fetch --legacy-peer-deps

# Start backend server
echo "🔧 Starting Express backend server..."
node server.js &

# Wait a moment for server to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
npm run dev

echo "✅ Setup complete!"
echo "📱 Frontend: http://localhost:4001"
echo "🔧 Backend: http://localhost:3001"
echo "💬 Chat API: http://localhost:3001/api/chat"
echo ""
echo "🧪 Test the API:"
echo "curl -X POST http://localhost:3001/api/chat -H 'Content-Type: application/json' -d '{\"message\":\"Hello\"}'"
