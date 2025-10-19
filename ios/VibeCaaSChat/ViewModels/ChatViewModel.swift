import SwiftUI
import Combine

@MainActor
class ChatViewModel: ObservableObject {
    @Published var conversation: Conversation?
    @Published var messages: [Message] = []
    @Published var isLoading = false
    @Published var isSendingMessage = false
    @Published var error: String?
    @Published var streamingMessage: String = ""
    @Published var currentInput: String = ""
    
    private let conversationId: String
    private let apiClient = APIClient.shared
    
    init(conversationId: String) {
        self.conversationId = conversationId
    }
    
    func loadConversation() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            let conv = try await apiClient.fetchConversation(id: conversationId)
            conversation = conv
            messages = conv.messages
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func sendMessage(_ text: String) async {
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        
        isSendingMessage = true
        streamingMessage = ""
        
        // Add user message immediately
        let userMessage = Message(
            id: UUID().uuidString,
            from: .user,
            content: text,
            createdAt: Date()
        )
        messages.append(userMessage)
        currentInput = ""
        
        // Create placeholder assistant message
        let assistantMessageId = UUID().uuidString
        let assistantMessage = Message(
            id: assistantMessageId,
            from: .assistant,
            content: "",
            createdAt: Date()
        )
        messages.append(assistantMessage)
        
        do {
            let stream = try await apiClient.sendMessage(conversationId: conversationId, message: text)
            
            for try await token in stream {
                streamingMessage += token
                
                // Update the last message
                if let lastIndex = messages.lastIndex(where: { $0.id == assistantMessageId }) {
                    messages[lastIndex] = Message(
                        id: assistantMessageId,
                        from: .assistant,
                        content: streamingMessage,
                        createdAt: Date()
                    )
                }
            }
            
            streamingMessage = ""
            isSendingMessage = false
            
            // Reload conversation to get the complete state
            await loadConversation()
        } catch {
            // Remove the placeholder message on error
            messages.removeAll { $0.id == assistantMessageId }
            self.error = error.localizedDescription
            isSendingMessage = false
            streamingMessage = ""
        }
    }
    
    func retryLastMessage() async {
        guard let lastUserMessage = messages.last(where: { $0.from == .user }) else { return }
        
        // Remove last assistant message if exists
        if let lastMessage = messages.last, lastMessage.from == .assistant {
            messages.removeLast()
        }
        
        await sendMessage(lastUserMessage.content)
    }
}
