# VibeCaaSChat - Quick Start Guide

Get up and running with VibeCaaSChat in minutes!

## 🚀 30-Second Overview

VibeCaaSChat is an AI chat platform with:
- **Web App**: SvelteKit-based browser interface
- **iOS App**: Native SwiftUI mobile app
- **Shared Backend**: Both apps use the same API and database

## ⚡ Quick Start - Web App

```bash
# 1. Clone and install
git clone <repository-url>
cd vibecaas-chat
npm install

# 2. Configure (minimal)
echo "OPENAI_API_KEY=your_key_here" > .env.local

# 3. Start MongoDB (if local)
mongod

# 4. Run
npm run dev
```

Open http://localhost:5173 🎉

## 📱 Quick Start - iOS App

```bash
# 1. Ensure backend is running (see above)

# 2. Open iOS project
cd ios
open VibeCaaSChat.xcodeproj

# 3. In Xcode, press Cmd+R to build and run
```

That's it! 🎉

## 🔧 Minimal Configuration

### Backend (.env.local)

```env
# Required
OPENAI_API_KEY=sk-your-api-key
MONGODB_URL=mongodb://localhost:27017

# Optional - will use defaults
PUBLIC_APP_NAME=VibeCaaSChat
```

### iOS App

No configuration needed for simulator!

For physical device, update `APIClient.swift`:
```swift
init(baseURL: String = "http://YOUR_COMPUTER_IP:5173") {
```

## 📋 Prerequisites

### For Web App
- Node.js 18+ ✓
- npm 9+ ✓
- MongoDB ✓

### For iOS App
- macOS 12+ ✓
- Xcode 15+ ✓
- iOS 16+ device/simulator ✓

## 🎯 First Steps

### 1. Start Web App
```bash
npm run dev
```

### 2. Test in Browser
- Open http://localhost:5173
- Click "New Chat"
- Send a message

### 3. Start iOS App
- Open project in Xcode
- Build and run
- Same backend, different interface!

## 🐛 Common Issues

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo:5
```

### "No models available"
Check your API key:
```bash
echo $OPENAI_API_KEY
# or check .env.local
```

### iOS "Cannot connect to backend"
- Ensure backend is running
- Check URL in APIClient.swift
- For device: Use computer's IP, not localhost

## 📚 Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Full documentation
   - [ios/README.md](ios/README.md) - iOS specifics
   - [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Complete overview

2. **Explore Features**
   - Try different AI models
   - Customize system prompts
   - Create multiple conversations

3. **Deploy**
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

## 🎨 Customization

### Change App Name
Edit `.env.local`:
```env
PUBLIC_APP_NAME=YourAppName
```

### Change Theme
Edit `tailwind.config.cjs` for web
Edit `AccentColor.colorset` for iOS

### Add Models
Configure in `.env.local`:
```env
MODELS='[{"id":"model-id","name":"Model Name"}]'
```

## 🧪 Test Your Setup

### Web App
```bash
# Should see models list
curl http://localhost:5173/api/v2/models

# Should see empty conversations
curl http://localhost:5173/api/v2/conversations
```

### iOS App
1. Launch app
2. Tap "New Chat"
3. Type message
4. See AI response streaming in

## 💡 Pro Tips

1. **Development Mode**
   - Web: Hot reload enabled automatically
   - iOS: Use SwiftUI Previews for fast iteration

2. **Debugging**
   - Web: Check browser console
   - iOS: Check Xcode console

3. **Database**
   - Use MongoDB Compass to view data
   - Collections: conversations, settings, users

## 🔗 Useful Links

- **OpenAI API**: https://openai.com/api
- **MongoDB**: https://www.mongodb.com
- **SvelteKit**: https://kit.svelte.dev
- **SwiftUI**: https://developer.apple.com/xcode/swiftui

## 📞 Getting Help

- Check [TROUBLESHOOTING.md](DEPLOYMENT.md#troubleshooting)
- Review logs
- Check GitHub issues

## 🎉 You're Ready!

You now have:
- ✅ Web app running
- ✅ iOS app running
- ✅ Shared database
- ✅ AI chat working

Start chatting! 💬

---

**Full Documentation**: See [README.md](README.md)
**iOS Setup**: See [ios/GETTING_STARTED.md](ios/GETTING_STARTED.md)
