import SwiftUI
import Combine

@MainActor
class AppState: ObservableObject {
    @Published var conversations: [ConversationSidebar] = []
    @Published var selectedConversation: ConversationSidebar?
    @Published var models: [Model] = []
    @Published var settings: Settings = .default
    @Published var user: User?
    @Published var publicConfig: PublicConfig?
    @Published var isLoading = false
    @Published var error: String?
    
    private let apiClient = APIClient.shared
    
    func initialize() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            async let modelsTask = apiClient.fetchModels()
            async let conversationsTask = apiClient.fetchConversations()
            async let settingsTask = apiClient.fetchSettings()
            async let configTask = apiClient.fetchPublicConfig()
            
            let (fetchedModels, conversationsResponse, fetchedSettings, config) = try await (
                modelsTask,
                conversationsTask,
                settingsTask,
                configTask
            )
            
            models = fetchedModels
            conversations = conversationsResponse.conversations
            settings = fetchedSettings
            publicConfig = config
            
            // Set default active model if not set
            if settings.activeModel.isEmpty, let firstModel = models.first {
                settings.activeModel = firstModel.id
            }
            
            // Try to fetch user (may fail if not logged in)
            do {
                user = try await apiClient.fetchUser()
            } catch {
                user = nil
            }
        } catch {
            self.error = error.localizedDescription
            print("Initialization error: \(error)")
        }
    }
    
    func refreshConversations() async {
        do {
            let response = try await apiClient.fetchConversations()
            conversations = response.conversations
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func createNewConversation() {
        Task {
            do {
                let modelId = settings.activeModel.isEmpty ? (models.first?.id ?? "") : settings.activeModel
                let preprompt = settings.customPrompts[modelId]
                
                let conversationId = try await apiClient.createConversation(
                    model: modelId,
                    preprompt: preprompt
                )
                
                await refreshConversations()
                
                // Select the new conversation
                if let newConv = conversations.first(where: { $0.id == conversationId }) {
                    selectedConversation = newConv
                }
            } catch {
                self.error = error.localizedDescription
            }
        }
    }
    
    func deleteConversation(_ id: String) async {
        do {
            try await apiClient.deleteConversation(id: id)
            conversations.removeAll { $0.id == id }
            
            if selectedConversation?.id == id {
                selectedConversation = nil
            }
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func updateConversationTitle(_ id: String, title: String) async {
        do {
            try await apiClient.updateConversationTitle(id: id, title: title)
            
            if let index = conversations.firstIndex(where: { $0.id == id }) {
                conversations[index].title = title
            }
            
            if selectedConversation?.id == id {
                selectedConversation?.title = title
            }
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func updateSettings(_ newSettings: Settings) async {
        do {
            try await apiClient.updateSettings(newSettings)
            settings = newSettings
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func selectConversation(_ conversation: ConversationSidebar) {
        selectedConversation = conversation
    }
}
