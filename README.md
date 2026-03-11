# AI Chatbot - Complete Setup & Run Guide

## 🚀 Quick Start (Windows)

```bash
# Run the setup script
start.bat
```

## 🛠️ Manual Setup

### 1. Configure API Key
Edit `.env` file and replace placeholder:
```
GROQ_API_KEY=gsk_your_real_api_key_here
```

Get your free API key from: https://console.groq.com/

### 2. Install Dependencies
```bash
npm install express cors dotenv node-fetch --legacy-peer-deps
```

### 3. Start Backend Server
```bash
node server.js
```

### 4. Start Frontend (in new terminal)
```bash
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:4001
- **Backend Health**: http://localhost:3001/health
- **Chat API**: http://localhost:3001/api/chat

## 🧪 Test API Directly

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What are symptoms of flu?"}'
```

## 🔧 Architecture

```
Frontend (Vite + React)     Backend (Express.js)
     :4001                           :3001
        |                               |
        |  POST /api/chat               |
        |------------------------------->|
        |                               |  Groq API
        |                               |  (Llama 3.1)
        |<-------------------------------|
        |    AI Response                |
```

## 📁 Project Structure

```
apps/web/
├── server.js              # Express backend server
├── .env                   # Environment variables
├── src/app/chat/page.jsx   # Frontend chat interface
├── src/app/api/chat/route.js # React Router API (backup)
├── start.bat              # Windows setup script
├── start.sh               # Linux/Mac setup script
└── SETUP.md              # This file
```

## 🔑 Environment Variables

```bash
# Required
GROQ_API_KEY=gsk_your_real_api_key_here

# Optional
PORT=3001
NODE_ENV=development
```

## 🚨 Troubleshooting

### API Key Issues
- Ensure key starts with `gsk_`
- Check `.env` file is in `apps/web/` directory
- Restart servers after updating key

### Connection Issues
- Check backend is running on port 3001
- Verify frontend is running on port 4001
- Check browser console for CORS errors

### Dependency Issues
- Use `--legacy-peer-deps` flag for npm install
- Delete `node_modules` and reinstall if needed

## 🎯 Features

- ✅ **Real AI Responses** via Groq Llama 3.1 8B Instant
- ✅ **Professional Medical Tone** with safety disclaimers
- ✅ **Emergency Detection** for critical symptoms
- ✅ **Fallback Responses** when API is unavailable
- ✅ **No Data Storage** - conversations are temporary
- ✅ **Error Handling** with clear logging
- ✅ **CORS Enabled** for frontend-backend communication

## 🏥 Medical Safety

The AI assistant includes:
- Emergency symptom detection
- Professional medical disclaimers
- Clear guidance to seek professional care
- Evidence-based health information
- Compassionate yet formal communication

---

**⚠️ Medical Disclaimer**: This AI provides health information and guidance, not medical advice. Always consult healthcare professionals for medical concerns.
