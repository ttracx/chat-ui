# VibeCaaSChat iOS Architecture

## Overview

The VibeCaaSChat iOS app follows the MVVM (Model-View-ViewModel) architecture pattern with SwiftUI, providing a clean separation of concerns and reactive data flow.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         SwiftUI Views                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Chat    │  │   List   │  │ Settings │  │  Models  │   │
│  │  View    │  │   View   │  │   View   │  │   View   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
        ┌─────────────────▼──────────────────────┐
        │         ViewModels Layer               │
        │  ┌──────────────┐  ┌────────────────┐ │
        │  │  AppState    │  │ ChatViewModel  │ │
        │  │ (Global)     │  │ (Per-Chat)     │ │
        │  └──────┬───────┘  └────────┬───────┘ │
        └─────────┼──────────────────┼──────────┘
                  │                  │
        ┌─────────▼──────────────────▼──────────┐
        │         Services Layer                 │
        │  ┌────────────────────────────────┐   │
        │  │         APIClient              │   │
        │  │  - REST APIs                   │   │
        │  │  - Server-Sent Events (SSE)    │   │
        │  │  - Cookie Management           │   │
        │  └────────────────────────────────┘   │
        └───────────────────┬────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │              Backend API               │
        │   (Same as Web App - SvelteKit)       │
        │   - MongoDB Database                   │
        │   - OpenAI-compatible Models           │
        └────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Views Layer (SwiftUI)

**Purpose:** User interface and user interactions

**Files:**
- `ContentView.swift` - Root navigation container
- `ChatView.swift` - Individual conversation UI
- `ConversationListView.swift` - List of conversations
- `MessageView.swift` - Individual message display
- `SettingsView.swift` - Settings and preferences
- `ModelsView.swift` - Model selection
- `LoginView.swift` - Authentication

**Characteristics:**
- Pure SwiftUI views
- Minimal business logic
- Reactive to state changes
- Uses `@EnvironmentObject`, `@StateObject`, `@State`

**Example Pattern:**
```swift
struct ChatView: View {
    @StateObject private var viewModel: ChatViewModel
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        // UI declaration
    }
}
```

### 2. ViewModels Layer

**Purpose:** Business logic, state management, and data transformation

#### AppState (Global State)

**Responsibilities:**
- Application-wide state
- Conversation list management
- Model list
- User settings
- User authentication state
- Global operations (create, delete conversations)

**Key Properties:**
```swift
@Published var conversations: [ConversationSidebar]
@Published var selectedConversation: ConversationSidebar?
@Published var models: [Model]
@Published var settings: Settings
@Published var user: User?
```

**Key Methods:**
- `initialize()` - Load initial data
- `createNewConversation()` - Create new chat
- `deleteConversation()` - Remove conversation
- `updateSettings()` - Save preferences

#### ChatViewModel (Per-Conversation)

**Responsibilities:**
- Single conversation state
- Message management
- Streaming message handling
- Send/retry message logic

**Key Properties:**
```swift
@Published var conversation: Conversation?
@Published var messages: [Message]
@Published var streamingMessage: String
@Published var isSendingMessage: Bool
```

**Key Methods:**
- `loadConversation()` - Load conversation data
- `sendMessage()` - Send message with streaming
- `retryLastMessage()` - Retry failed message

### 3. Services Layer

#### APIClient (Singleton)

**Responsibilities:**
- HTTP communication with backend
- Request/response handling
- Error handling
- Cookie management
- Server-Sent Events (SSE) for streaming

**Key Features:**

1. **RESTful Endpoints:**
   ```swift
   func fetchConversations() async throws -> ConversationsResponse
   func createConversation(model: String, preprompt: String?) async throws -> String
   func deleteConversation(id: String) async throws
   func updateConversationTitle(id: String, title: String) async throws
   ```

2. **Streaming Support:**
   ```swift
   func sendMessage(conversationId: String, message: String) 
       async throws -> AsyncThrowingStream<String, Error>
   ```

3. **Settings & Configuration:**
   ```swift
   func fetchSettings() async throws -> Settings
   func updateSettings(_ settings: Settings) async throws
   func fetchModels() async throws -> [Model]
   ```

### 4. Models Layer

**Purpose:** Data structures matching backend API

**Files:**
- `Models.swift` - All data models

**Key Models:**

```swift
// Core conversation types
struct Conversation: Identifiable, Codable
struct ConversationSidebar: Identifiable, Codable
struct Message: Identifiable, Codable

// Configuration types
struct Model: Identifiable, Codable
struct Settings: Codable
struct User: Codable
struct PublicConfig: Codable

// Request/Response types
struct CreateConversationRequest: Codable
struct SendMessageRequest: Codable
```

## Data Flow

### 1. App Launch Flow

```
App Start
    │
    ├─> VibeCaasChatApp initializes AppState
    │
    ├─> ContentView displays
    │
    ├─> AppState.initialize() called
    │       │
    │       ├─> Parallel fetch:
    │       │   - Models
    │       │   - Conversations
    │       │   - Settings
    │       │   - Config
    │       │   - User (optional)
    │       │
    │       └─> Update @Published properties
    │
    └─> UI updates automatically (SwiftUI reactivity)
```

### 2. Send Message Flow

```
User types message
    │
    ├─> ChatView captures input
    │
    ├─> ChatViewModel.sendMessage() called
    │       │
    │       ├─> Add user message to local array
    │       │
    │       ├─> Create placeholder assistant message
    │       │
    │       ├─> APIClient.sendMessage() - returns AsyncStream
    │       │       │
    │       │       ├─> HTTP POST with SSE Accept header
    │       │       │
    │       │       ├─> Parse streaming response
    │       │       │   data: {"type": "stream", "token": "Hello"}
    │       │       │   data: {"type": "stream", "token": " there"}
    │       │       │   data: {"type": "finalAnswer", "text": "..."}
    │       │       │
    │       │       └─> Yield tokens via AsyncStream
    │       │
    │       ├─> For each token:
    │       │   - Append to streamingMessage
    │       │   - Update message in array
    │       │   - SwiftUI auto-updates UI
    │       │
    │       └─> On completion: reload conversation
    │
    └─> UI shows final message
```

### 3. Navigation Flow

```
ConversationListView
    │
    ├─> User taps conversation
    │
    ├─> AppState.selectConversation() called
    │   - Sets selectedConversation
    │
    ├─> ContentView observes change
    │
    ├─> Shows ChatView in detail pane
    │   - ChatViewModel initialized with conversationId
    │
    ├─> ChatView.task {} called
    │   - Loads conversation data
    │   - Populates messages
    │
    └─> User can send messages
```

## State Management

### @Published Properties

All state is managed through Combine's `@Published` property wrapper:

```swift
@Published var conversations: [ConversationSidebar] = []
```

When this property changes:
1. Publishers emit new value
2. SwiftUI views observing it automatically re-render
3. No manual UI updates needed

### EnvironmentObject

Shared state across view hierarchy:

```swift
// In App:
ContentView()
    .environmentObject(appState)

// In any child view:
@EnvironmentObject var appState: AppState
```

### StateObject vs ObservedObject

- `@StateObject` - View owns the object lifecycle
- `@ObservedObject` - View observes external object
- `@EnvironmentObject` - Shared across view tree

## Networking

### HTTP Client

Uses native `URLSession` with async/await:

```swift
let (data, response) = try await session.data(for: request)
```

### Cookie-Based Authentication

Session cookies are automatically managed:

```swift
let config = URLSessionConfiguration.default
config.httpCookieAcceptPolicy = .always
config.httpShouldSetCookies = true
```

### Server-Sent Events (SSE)

For message streaming:

```swift
let (bytes, _) = try await session.bytes(for: request)

for try await byte in bytes {
    // Parse SSE format
    // data: {"type": "stream", "token": "..."}
    
    if line.hasPrefix("data: ") {
        let json = parseJSON(line)
        yield json.token
    }
}
```

### Error Handling

Custom error enum for clear error messages:

```swift
enum APIError: LocalizedError {
    case invalidResponse
    case httpError(Int)
    case serverError(String)
    case decodingError
}
```

## Concurrency

### Async/Await

All network calls use Swift's modern async/await:

```swift
func loadConversation() async {
    do {
        let conv = try await apiClient.fetchConversation(id: conversationId)
        conversation = conv
    } catch {
        self.error = error.localizedDescription
    }
}
```

### Main Actor

UI updates must happen on main thread:

```swift
@MainActor
class AppState: ObservableObject { ... }
```

### Parallel Execution

Load multiple resources simultaneously:

```swift
async let modelsTask = apiClient.fetchModels()
async let conversationsTask = apiClient.fetchConversations()

let (models, conversations) = try await (modelsTask, conversationsTask)
```

## Testing Strategy

### Unit Tests
- Test ViewModels independently
- Mock APIClient
- Verify state changes

### UI Tests
- Test user flows
- Verify navigation
- Check text rendering

### Preview Tests
- Use SwiftUI previews
- Test with sample data

## Best Practices

1. **Separation of Concerns**
   - Views only render UI
   - ViewModels handle logic
   - Services handle networking

2. **Single Source of Truth**
   - State lives in ViewModels
   - Views react to state changes
   - No duplicate state

3. **Immutable Data**
   - Models are value types (structs)
   - Copy-on-write semantics
   - Thread-safe

4. **Error Handling**
   - Always handle errors
   - Show user-friendly messages
   - Log for debugging

5. **Async Operations**
   - Use Task for fire-and-forget
   - Use async/await for sequential
   - Use async let for parallel

## Performance Considerations

1. **Lazy Loading**
   - Use LazyVStack for long lists
   - Load conversations on demand

2. **Memory Management**
   - ViewModels are class objects (reference types)
   - Released when views disappear
   - No manual cleanup needed

3. **Network Efficiency**
   - Parallel requests where possible
   - Cache frequently accessed data
   - Reuse URLSession

4. **UI Responsiveness**
   - All network calls are async
   - UI never blocks
   - Loading states shown

## Future Enhancements

1. **Local Persistence**
   - CoreData for offline support
   - Cache conversations locally
   - Sync when online

2. **Push Notifications**
   - Background message checks
   - Notify user of new messages

3. **File Uploads**
   - Image picker integration
   - File encoding and upload
   - Progress indication

4. **Advanced Features**
   - Voice input
   - Text-to-speech
   - Markdown rendering improvements
   - Code syntax highlighting

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable and maintainable
- ✅ Reactive and responsive UI
- ✅ Type-safe networking
- ✅ Modern Swift patterns
- ✅ Compatible with backend API
