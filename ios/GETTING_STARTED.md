# Getting Started with VibeCaaSChat iOS App

This guide will help you set up and run the VibeCaaSChat iOS application.

## Prerequisites

- macOS Monterey (12.0) or later
- Xcode 15.0 or later
- iOS 16.0+ device or simulator
- Backend server running (the web app from parent directory)

## Quick Start

### 1. Set Up the Backend

First, ensure the backend server is running:

```bash
# From the root directory (parent of ios/)
npm install
npm run dev
```

The backend should be running on `http://localhost:5173`

### 2. Configure MongoDB

Make sure MongoDB is configured and running. Check your `.env` file:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=chat-ui
```

### 3. Open the iOS Project

```bash
cd ios
open VibeCaaSChat.xcodeproj
```

### 4. Update API Configuration (if needed)

If your backend is running on a different URL or port, update `APIClient.swift`:

```swift
init(baseURL: String = "http://localhost:5173") {
    // Change to your backend URL
    self.baseURL = baseURL
    // ...
}
```

**Note for iOS Simulator:** The simulator can access localhost directly.

**Note for Physical Device:** Replace `localhost` with your computer's local IP address (e.g., `http://192.168.1.100:5173`). Also, ensure `NSAllowsArbitraryLoads` is set to `true` in Info.plist for development.

### 5. Build and Run

1. Select a simulator or connected device from the scheme selector
2. Press `Cmd + R` or click the Play button
3. The app will build and launch

## Project Structure

```
ios/
├── VibeCaaSChat.xcodeproj/      # Xcode project file
├── VibeCaaSChat/
│   ├── VibeCaasChatApp.swift    # App entry point
│   ├── ContentView.swift        # Main app container
│   ├── Views/                   # SwiftUI views
│   │   ├── ChatView.swift
│   │   ├── ConversationListView.swift
│   │   ├── MessageView.swift
│   │   ├── SettingsView.swift
│   │   ├── ModelsView.swift
│   │   └── LoginView.swift
│   ├── ViewModels/              # State management
│   │   ├── AppState.swift
│   │   └── ChatViewModel.swift
│   ├── Models/                  # Data models
│   │   └── Models.swift
│   ├── Services/                # API and services
│   │   └── APIClient.swift
│   ├── Assets.xcassets/         # Images and colors
│   └── Info.plist              # App configuration
├── README.md
├── GETTING_STARTED.md
└── .gitignore
```

## Features Overview

### Main Features

1. **Conversation List**
   - View all your conversations
   - Search conversations
   - Create new chats
   - Delete conversations with swipe gesture
   - Edit conversation titles

2. **Chat Interface**
   - Real-time message streaming
   - Markdown rendering
   - File attachment support
   - Message timestamps
   - Retry failed messages

3. **Model Selection**
   - Browse available AI models
   - View model details and parameters
   - Switch between models
   - See multimodal capabilities

4. **Settings**
   - Configure active model
   - Customize system prompts per model
   - Toggle streaming
   - Manage preferences
   - View account information

## Testing the App

### Test Flow

1. **Launch App** → Should load conversations list
2. **Create New Chat** → Tap "New Chat" button
3. **Send Message** → Type and send a message
4. **View Response** → See streaming AI response
5. **Change Model** → Go to Settings → Select different model
6. **Test Settings** → Configure custom prompt
7. **Delete Chat** → Swipe left on conversation

### Common Issues

#### Backend Not Reachable

**Problem:** App shows "Invalid response from server"

**Solutions:**
- Check backend is running: Visit `http://localhost:5173` in browser
- Verify URL in `APIClient.swift`
- For physical device: Use computer's IP instead of localhost
- Check firewall settings

#### No Models Available

**Problem:** Empty models list or "No models available"

**Solutions:**
- Ensure `OPENAI_BASE_URL` and `OPENAI_API_KEY` are configured in backend `.env`
- Check backend logs for errors
- Restart backend server

#### Messages Not Sending

**Problem:** Messages don't get responses

**Solutions:**
- Check network connection
- Verify model is properly configured
- Check backend API logs
- Ensure MongoDB is running

#### Build Errors

**Problem:** Xcode build fails

**Solutions:**
- Clean build folder: `Cmd + Shift + K`
- Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- Update Xcode to latest version
- Check Swift version compatibility

## Development Tips

### Debugging

1. **Enable Debug Logs**
   ```swift
   // Add to APIClient
   print("Request: \(request.url?.absoluteString ?? "")")
   print("Response: \(String(data: data, encoding: .utf8) ?? "")")
   ```

2. **Use Xcode Debugger**
   - Set breakpoints in ViewModels
   - Use `po` command to inspect variables
   - Monitor network requests in Network Link Conditioner

3. **Preview Components**
   - Use SwiftUI Previews for quick UI iteration
   - Add sample data for previews

### Hot Tips

- **Fast Iteration**: Use SwiftUI Previews (`Cmd + Opt + Enter`)
- **UI Inspector**: `Cmd + Click` on any view in Preview
- **Memory Graph**: Debug → Debug Workflow → View Memory Graph
- **Performance**: Instruments → Time Profiler

## API Endpoints Reference

All endpoints match the backend API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v2/conversations` | GET | List conversations |
| `/api/v2/conversations/:id` | GET | Get conversation |
| `/conversation` | POST | Create conversation |
| `/conversation/:id` | POST | Send message (SSE) |
| `/api/v2/conversations/:id` | DELETE | Delete conversation |
| `/api/v2/conversations/:id` | PATCH | Update conversation |
| `/api/v2/models` | GET | List models |
| `/api/v2/user/settings` | GET | Get settings |
| `/api/v2/user/settings` | PATCH | Update settings |
| `/api/v2/user` | GET | Get user info |

## Next Steps

### Customization

1. **Branding**
   - Replace app icons in `Assets.xcassets/AppIcon.appiconset/`
   - Update accent color in `AccentColor.colorset`
   - Modify app name in Info.plist

2. **Features**
   - Add file upload UI
   - Implement voice input
   - Add image viewing for multimodal models
   - Create widgets

3. **Deployment**
   - Configure signing & capabilities
   - Update bundle identifier
   - Set up provisioning profiles
   - Submit to App Store

## Support

For issues or questions:
- Check the main README.md
- Review backend configuration
- Check Xcode console for errors
- Examine API responses

## License

Same as the main project.
