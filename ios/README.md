# VibeCaaSChat iOS App

A native iOS application for VibeCaaSChat that provides a seamless chat experience with AI models.

## Features

- 🎨 **Native SwiftUI Interface**: Beautiful, modern UI built entirely with SwiftUI
- 💬 **Real-time Chat**: Stream responses from AI models in real-time
- 📱 **Multiple Conversations**: Manage multiple chat conversations
- 🤖 **Model Selection**: Choose from available AI models
- ⚙️ **Customizable Settings**: Configure system prompts, preferences, and more
- 🔄 **Sync with Backend**: Uses the same backend API as the web app
- 📤 **Share Conversations**: Export and share your conversations
- 🌙 **Dark Mode Support**: Full support for light and dark themes

## Architecture

The app follows MVVM (Model-View-ViewModel) architecture:

- **Models**: Data structures matching the backend API (`Models.swift`)
- **Views**: SwiftUI views for each screen
  - `ContentView.swift`: Main app container with navigation
  - `ChatView.swift`: Individual conversation view
  - `ConversationListView.swift`: List of all conversations
  - `MessageView.swift`: Individual message display
  - `SettingsView.swift`: App settings and preferences
  - `ModelsView.swift`: Browse and select AI models
  - `LoginView.swift`: Authentication screen
- **ViewModels**: Business logic and state management
  - `AppState.swift`: Global app state
  - `ChatViewModel.swift`: Individual chat logic
- **Services**: API communication
  - `APIClient.swift`: Backend API integration

## API Integration

The iOS app connects to the same backend as the web app. All endpoints are compatible:

- `GET /api/v2/conversations` - List conversations
- `GET /api/v2/conversations/:id` - Get conversation details
- `POST /conversation` - Create new conversation
- `POST /conversation/:id` - Send message (streaming)
- `DELETE /api/v2/conversations/:id` - Delete conversation
- `PATCH /api/v2/conversations/:id` - Update conversation
- `GET /api/v2/models` - List available models
- `GET /api/v2/user/settings` - Get user settings
- `PATCH /api/v2/user/settings` - Update settings
- `GET /api/v2/user` - Get user info
- `GET /api/v2/public-config` - Get public configuration

## Requirements

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- Backend server running (web app)

## Configuration

Update the `baseURL` in `APIClient.swift` to point to your backend:

```swift
init(baseURL: String = "http://localhost:5173") {
    // or your production URL
    // init(baseURL: String = "https://your-domain.com")
    self.baseURL = baseURL
    // ...
}
```

## Building and Running

1. Open `VibeCaaSChat.xcodeproj` in Xcode
2. Select your target device or simulator
3. Press `Cmd + R` to build and run

## Key Components

### AppState
Central state management for the entire app. Handles:
- Loading conversations, models, and settings
- Creating, deleting, and updating conversations
- Managing selected conversation
- User authentication state

### ChatViewModel
Manages individual chat conversations:
- Loading messages
- Sending messages with streaming support
- Handling errors
- Retry functionality

### APIClient
Singleton service for all backend communication:
- RESTful API calls
- Server-sent events (SSE) for streaming
- Error handling
- Cookie-based authentication

## Data Models

All models mirror the backend TypeScript types:

- `Conversation`: Full conversation with messages
- `ConversationSidebar`: Lightweight conversation for lists
- `Message`: Individual chat message
- `Model`: AI model configuration
- `Settings`: User preferences
- `User`: User account information
- `PublicConfig`: Public app configuration

## Streaming Implementation

Messages are streamed in real-time using Server-Sent Events (SSE):

```swift
let stream = try await apiClient.sendMessage(conversationId: id, message: text)
for try await token in stream {
    streamingMessage += token
    // Update UI in real-time
}
```

## Error Handling

Comprehensive error handling with user-friendly messages:
- Network errors
- API errors
- Decoding errors
- Timeout handling

## Future Enhancements

- [ ] File upload support
- [ ] Image generation and display
- [ ] Voice input
- [ ] Push notifications
- [ ] Offline message queue
- [ ] iCloud sync
- [ ] iPad optimization with enhanced layouts
- [ ] macOS Catalyst support
- [ ] Widgets
- [ ] Siri shortcuts
- [ ] ShareSheet integration

## License

Same as the main project.
