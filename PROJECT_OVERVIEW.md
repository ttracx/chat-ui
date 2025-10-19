# VibeCaaSChat - Complete Project Overview

## 🎯 Project Description

**VibeCaaSChat** (AI-powered Conversations as a Service) is a full-stack chat application that provides access to multiple AI models through a unified interface. The project includes:

1. **Web Application** - SvelteKit-based web interface
2. **iOS Application** - Native SwiftUI app
3. **Backend API** - Node.js server with MongoDB
4. **Shared Database** - Both web and iOS apps use the same backend

## 📁 Repository Structure

```
vibecaas-chat/
├── src/                          # Web app source (SvelteKit)
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   ├── server/              # Server-side code
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utility functions
│   │   └── stores/              # Svelte stores
│   └── routes/                  # SvelteKit routes
│       ├── api/                 # API endpoints
│       ├── conversation/        # Chat pages
│       ├── settings/            # Settings pages
│       └── models/              # Model browsing
│
├── ios/                         # iOS app (Swift/SwiftUI)
│   ├── VibeCaaSChat.xcodeproj/ # Xcode project
│   └── VibeCaaSChat/
│       ├── Views/               # SwiftUI views
│       ├── ViewModels/          # State management
│       ├── Models/              # Data models
│       ├── Services/            # API client
│       └── Assets.xcassets/     # Images & colors
│
├── static/                      # Static assets
├── chart/                       # Kubernetes/Helm configs
├── scripts/                     # Build & utility scripts
├── .env                         # Environment configuration
├── package.json                 # Node dependencies
├── README.md                    # Main documentation
└── PROJECT_OVERVIEW.md          # This file
```

## 🏗️ Architecture

### Web Application (SvelteKit)

```
User Browser
     │
     ├─> SvelteKit Frontend (Svelte 5)
     │   ├─> Routes (pages)
     │   ├─> Components
     │   └─> Stores (state management)
     │
     ├─> API Routes (+server.ts files)
     │   ├─> REST endpoints
     │   ├─> SSE streaming
     │   └─> Authentication
     │
     └─> Backend Services
         ├─> OpenAI-compatible API client
         ├─> MongoDB database
         └─> Model providers
```

### iOS Application (SwiftUI)

```
iOS App
     │
     ├─> SwiftUI Views
     │   ├─> Chat Interface
     │   ├─> Conversation List
     │   └─> Settings
     │
     ├─> ViewModels (MVVM)
     │   ├─> AppState (global)
     │   └─> ChatViewModel (per-chat)
     │
     └─> APIClient Service
         └─> HTTP requests to backend
```

### Backend API

```
Shared Backend (Node.js + SvelteKit)
     │
     ├─> API v2 Endpoints (/api/v2/*)
     │   ├─> Conversations
     │   ├─> Messages
     │   ├─> Models
     │   ├─> Settings
     │   └─> User
     │
     ├─> Database (MongoDB)
     │   ├─> conversations
     │   ├─> messages
     │   ├─> settings
     │   └─> users
     │
     └─> AI Model Providers
         └─> OpenAI-compatible endpoints
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB
- For iOS: Xcode 15+, macOS 12+

### 1. Setup Backend & Web App

```bash
# Clone repository
git clone <repository-url>
cd vibecaas-chat

# Install dependencies
npm install

# Configure environment
cp .env .env.local
# Edit .env.local with your settings

# Start MongoDB (if local)
mongod --dbpath ./data/db

# Run development server
npm run dev
```

Web app will be available at `http://localhost:5173`

### 2. Setup iOS App

```bash
# Navigate to iOS directory
cd ios

# Open in Xcode
open VibeCaaSChat.xcodeproj

# Build and run (Cmd + R)
```

See [ios/GETTING_STARTED.md](ios/GETTING_STARTED.md) for detailed iOS setup.

## 🔑 Configuration

### Environment Variables (.env)

**Required:**
```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=chat-ui

# AI Model Provider
OPENAI_BASE_URL=https://router.huggingface.co/v1
OPENAI_API_KEY=your_api_key_here

# App Info
PUBLIC_APP_NAME=VibeCaaSChat
PUBLIC_APP_ASSETS=chatui
PUBLIC_APP_DESCRIPTION="AI-powered conversations as a service"
```

**Optional:**
```env
# Authentication (OAuth/OpenID)
OPENID_CLIENT_ID=
OPENID_CLIENT_SECRET=
OPENID_PROVIDER_URL=

# Rate Limiting
USAGE_LIMITS={}

# Features
LLM_SUMMARIZATION=true
ENABLE_DATA_EXPORT=true
```

### iOS Configuration

Update `APIClient.swift`:
```swift
init(baseURL: String = "http://localhost:5173") {
    // For production: "https://your-domain.com"
    // For device testing: "http://192.168.1.x:5173"
    self.baseURL = baseURL
}
```

## 📱 Features

### Web App
- ✅ Real-time chat with AI models
- ✅ Multiple conversations
- ✅ Conversation history
- ✅ Model selection
- ✅ Custom system prompts
- ✅ File uploads
- ✅ Markdown rendering
- ✅ Code syntax highlighting
- ✅ Dark/light themes
- ✅ Mobile responsive
- ✅ Share conversations
- ✅ Export data

### iOS App
- ✅ Native Swift/SwiftUI interface
- ✅ Real-time message streaming
- ✅ Conversation management
- ✅ Model selection
- ✅ Settings sync
- ✅ Dark mode support
- ✅ Pull-to-refresh
- ✅ Swipe gestures
- ✅ Search conversations
- ✅ Custom prompts

## 🔌 API Endpoints

All endpoints are shared between web and iOS:

### Conversations
- `GET /api/v2/conversations` - List conversations
- `GET /api/v2/conversations/:id` - Get conversation
- `POST /conversation` - Create conversation
- `POST /conversation/:id` - Send message (SSE)
- `DELETE /api/v2/conversations/:id` - Delete
- `PATCH /api/v2/conversations/:id` - Update title

### Models
- `GET /api/v2/models` - List available models

### Settings
- `GET /api/v2/user/settings` - Get settings
- `PATCH /api/v2/user/settings` - Update settings

### User
- `GET /api/v2/user` - Get user info
- `POST /api/user/validate-token` - Validate auth token

### Configuration
- `GET /api/v2/public-config` - Get public config

## 🔐 Authentication

Both apps support:
- Guest mode (session-based)
- OAuth/OpenID authentication
- Cookie-based sessions
- Token validation

Configure in `.env`:
```env
OPENID_CLIENT_ID=your_client_id
OPENID_CLIENT_SECRET=your_client_secret
OPENID_PROVIDER_URL=https://your-provider.com
```

## 🗄️ Database Schema

### MongoDB Collections

**conversations:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: String,
  model: String,
  title: String,
  messages: Array<Message>,
  preprompt: String,
  createdAt: Date,
  updatedAt: Date
}
```

**messages:**
```javascript
{
  id: UUID,
  from: "user" | "assistant" | "system",
  content: String,
  files: Array<MessageFile>,
  score: Number,
  createdAt: Date
}
```

**settings:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: String,
  activeModel: String,
  customPrompts: Object,
  shareConversationsWithModelAuthors: Boolean,
  disableStream: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Tech Stack

### Web App
- **Framework:** SvelteKit 2.x
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** MongoDB
- **Runtime:** Node.js
- **Deployment:** Docker, Kubernetes

### iOS App
- **Framework:** SwiftUI
- **Language:** Swift 5.9+
- **Architecture:** MVVM
- **Networking:** URLSession + async/await
- **Min iOS:** 16.0+

### Backend
- **Server:** SvelteKit (Node.js)
- **Database:** MongoDB 5+
- **API Style:** REST + Server-Sent Events (SSE)
- **Authentication:** OpenID Connect

## 📊 Development Workflow

### Web App Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
npm test             # Run tests
```

### iOS App Development
```bash
# In Xcode:
Cmd + R              # Build and run
Cmd + U              # Run tests
Cmd + B              # Build only
Cmd + Shift + K      # Clean build
```

## 🧪 Testing

### Web App
```bash
npm test             # Run all tests
npm run test:unit    # Unit tests only
npm run test:e2e     # End-to-end tests
```

### iOS App
```bash
# In Xcode:
Cmd + U              # Run unit tests
# Or from terminal:
xcodebuild test -scheme VibeCaaSChat
```

## 🚢 Deployment

### Web App (Docker)
```bash
docker build -t vibecaas-chat .
docker run -p 3000:3000 vibecaas-chat
```

### Web App (Kubernetes)
```bash
helm install vibecaas-chat ./chart \
  --values ./chart/env/prod.yaml
```

### iOS App
1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review

## 📈 Performance

### Web App
- Server-side rendering (SSR)
- Static generation for pages
- Code splitting
- Lazy loading
- Image optimization

### iOS App
- Native performance
- Efficient memory usage
- SwiftUI declarative UI
- Async/await concurrency
- Local caching

## 🔒 Security

- Environment-based secrets
- HTTPS enforcement
- Cookie security (secure, httpOnly)
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention (NoSQL)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Write tests
5. Submit pull request

## 📝 License

[Check LICENSE file in repository]

## 🐛 Known Issues

- Icon placeholders in iOS app need actual images
- Authentication not fully implemented in iOS
- File upload UI pending in iOS
- Web push notifications pending

## 🛣️ Roadmap

### Version 1.1
- [ ] Complete iOS file upload
- [ ] Push notifications
- [ ] Voice input (iOS)
- [ ] Improved error messages

### Version 1.2
- [ ] iPad optimized layouts
- [ ] macOS Catalyst support
- [ ] Widgets
- [ ] Shortcuts integration

### Version 2.0
- [ ] Offline support
- [ ] Local model inference
- [ ] Advanced analytics
- [ ] Team collaboration features

## 📞 Support

- Documentation: See README files
- Issues: GitHub Issues
- iOS Specific: [ios/README.md](ios/README.md)
- Architecture: [ios/ARCHITECTURE.md](ios/ARCHITECTURE.md)

## 🙏 Acknowledgments

Based on the open-source chat-ui project, adapted and enhanced for VibeCaaSChat with native iOS support.

---

**Project Status:** ✅ Active Development

**Last Updated:** 2025-10-19
