@echo off
echo 🚀 Starting AI Chatbot Setup...

REM Check if .env has real API key
findstr /C:"gsk_your_actual_api_key_here" .env >nul
if %errorlevel%==0 (
    echo ❌ ERROR: Please update .env file with your real Groq API key
    echo 📝 Steps:
    echo 1. Go to https://console.groq.com/
    echo 2. Sign up and get your API key
    echo 3. Update .env file: GROQ_API_KEY=gsk_your_real_key_here
    echo.
    echo ⚠️  Continuing setup, but API calls will fail until key is configured
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install express cors dotenv node-fetch --legacy-peer-deps

REM Start backend server
echo 🔧 Starting Express backend server...
start "Backend Server" cmd /k "node server.js"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🌐 Starting frontend...
call npm run dev

echo ✅ Setup complete!
echo 📱 Frontend: http://localhost:4001
echo 🔧 Backend: http://localhost:3001
echo 💬 Chat API: http://localhost:3001/api/chat
echo.
echo 🧪 Test the API:
echo curl -X POST http://localhost:3001/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Hello\"}"
pause
