import Foundation

// MARK: - Conversation Models
struct Conversation: Identifiable, Codable, Hashable {
    let id: String
    var title: String
    let model: String
    let updatedAt: Date
    var messages: [Message]
    var preprompt: String?
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case title
        case model
        case updatedAt
        case messages
        case preprompt
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        title = try container.decode(String.self, forKey: .title)
        model = try container.decode(String.self, forKey: .model)
        
        let dateString = try container.decode(String.self, forKey: .updatedAt)
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        updatedAt = formatter.date(from: dateString) ?? Date()
        
        messages = try container.decodeIfPresent([Message].self, forKey: .messages) ?? []
        preprompt = try container.decodeIfPresent(String.self, forKey: .preprompt)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(title, forKey: .title)
        try container.encode(model, forKey: .model)
        
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        try container.encode(formatter.string(from: updatedAt), forKey: .updatedAt)
        
        try container.encode(messages, forKey: .messages)
        try container.encodeIfPresent(preprompt, forKey: .preprompt)
    }
    
    init(id: String, title: String, model: String, updatedAt: Date, messages: [Message] = [], preprompt: String? = nil) {
        self.id = id
        self.title = title
        self.model = model
        self.updatedAt = updatedAt
        self.messages = messages
        self.preprompt = preprompt
    }
}

struct ConversationSidebar: Identifiable, Codable, Hashable {
    let id: String
    var title: String
    let model: String
    let updatedAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case title
        case model
        case updatedAt
    }
}

// MARK: - Message Models
struct Message: Identifiable, Codable, Hashable {
    let id: String
    let from: MessageFrom
    var content: String
    let createdAt: Date?
    var files: [MessageFile]?
    var score: Int?
    var interrupted: Bool?
    
    enum CodingKeys: String, CodingKey {
        case id
        case from
        case content
        case createdAt
        case files
        case score
        case interrupted
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        from = try container.decode(MessageFrom.self, forKey: .from)
        content = try container.decode(String.self, forKey: .content)
        
        if let dateString = try container.decodeIfPresent(String.self, forKey: .createdAt) {
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            createdAt = formatter.date(from: dateString)
        } else {
            createdAt = nil
        }
        
        files = try container.decodeIfPresent([MessageFile].self, forKey: .files)
        score = try container.decodeIfPresent(Int.self, forKey: .score)
        interrupted = try container.decodeIfPresent(Bool.self, forKey: .interrupted)
    }
    
    init(id: String, from: MessageFrom, content: String, createdAt: Date? = nil, files: [MessageFile]? = nil) {
        self.id = id
        self.from = from
        self.content = content
        self.createdAt = createdAt
        self.files = files
    }
}

enum MessageFrom: String, Codable {
    case user
    case assistant
    case system
}

struct MessageFile: Codable, Hashable {
    let type: String
    let name: String
    let value: String
    let mime: String
}

// MARK: - Model
struct Model: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let displayName: String
    let description: String?
    let websiteUrl: String?
    let preprompt: String?
    let parameters: ModelParameters?
    let multimodal: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case displayName
        case description
        case websiteUrl
        case preprompt
        case parameters
        case multimodal
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        displayName = try container.decode(String.self, forKey: .displayName)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        websiteUrl = try container.decodeIfPresent(String.self, forKey: .websiteUrl)
        preprompt = try container.decodeIfPresent(String.self, forKey: .preprompt)
        parameters = try container.decodeIfPresent(ModelParameters.self, forKey: .parameters)
        multimodal = try container.decodeIfPresent(Bool.self, forKey: .multimodal) ?? false
    }
    
    init(id: String, name: String, displayName: String, description: String? = nil, websiteUrl: String? = nil, preprompt: String? = nil, parameters: ModelParameters? = nil, multimodal: Bool = false) {
        self.id = id
        self.name = name
        self.displayName = displayName
        self.description = description
        self.websiteUrl = websiteUrl
        self.preprompt = preprompt
        self.parameters = parameters
        self.multimodal = multimodal
    }
}

struct ModelParameters: Codable, Hashable {
    let temperature: Double?
    let maxNewTokens: Int?
    let topP: Double?
    
    enum CodingKeys: String, CodingKey {
        case temperature
        case maxNewTokens = "max_new_tokens"
        case topP = "top_p"
    }
}

// MARK: - Settings
struct Settings: Codable {
    var shareConversationsWithModelAuthors: Bool
    var activeModel: String
    var customPrompts: [String: String]
    var multimodalOverrides: [String: Bool]
    var hidePromptExamples: [String: Bool]
    var disableStream: Bool
    var directPaste: Bool
    
    static let `default` = Settings(
        shareConversationsWithModelAuthors: true,
        activeModel: "",
        customPrompts: [:],
        multimodalOverrides: [:],
        hidePromptExamples: [:],
        disableStream: false,
        directPaste: false
    )
}

// MARK: - User
struct User: Codable, Hashable {
    let username: String?
    let email: String?
    let avatarUrl: String?
    let loggedIn: Bool
    
    enum CodingKeys: String, CodingKey {
        case username
        case email
        case avatarUrl
        case loggedIn
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        username = try container.decodeIfPresent(String.self, forKey: .username)
        email = try container.decodeIfPresent(String.self, forKey: .email)
        avatarUrl = try container.decodeIfPresent(String.self, forKey: .avatarUrl)
        loggedIn = try container.decodeIfPresent(Bool.self, forKey: .loggedIn) ?? false
    }
    
    init(username: String? = nil, email: String? = nil, avatarUrl: String? = nil, loggedIn: Bool = false) {
        self.username = username
        self.email = email
        self.avatarUrl = avatarUrl
        self.loggedIn = loggedIn
    }
}

// MARK: - API Response Models
struct ConversationsResponse: Codable {
    let conversations: [ConversationSidebar]
    let nConversations: Int
}

struct ConversationResponse: Codable {
    let conversation: Conversation
    let messages: [Message]
}

struct CreateConversationRequest: Codable {
    let model: String
    let preprompt: String?
}

struct CreateConversationResponse: Codable {
    let conversationId: String
}

struct SendMessageRequest: Codable {
    let inputs: String
    let id: String?
    let isRetry: Bool
    let isContinue: Bool
    let webSearch: Bool
    let files: [String]?
}

struct PublicConfig: Codable {
    let PUBLIC_APP_NAME: String
    let PUBLIC_APP_DESCRIPTION: String
    let PUBLIC_ORIGIN: String?
    let isHuggingChat: Bool
    let assetPath: String
}

// MARK: - Error Response
struct ErrorResponse: Codable {
    let message: String
}
