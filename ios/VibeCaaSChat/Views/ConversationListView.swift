import SwiftUI

struct ConversationListView: View {
    @EnvironmentObject var appState: AppState
    @State private var searchText = ""
    @State private var showingEditAlert = false
    @State private var editingConversation: ConversationSidebar?
    @State private var newTitle = ""
    
    var filteredConversations: [ConversationSidebar] {
        if searchText.isEmpty {
            return appState.conversations
        } else {
            return appState.conversations.filter { conversation in
                conversation.title.localizedCaseInsensitiveContains(searchText)
            }
        }
    }
    
    var body: some View {
        List {
            Section {
                Button(action: {
                    appState.createNewConversation()
                }) {
                    Label("New Chat", systemImage: "plus.message")
                        .font(.headline)
                        .foregroundColor(.blue)
                }
            }
            
            Section {
                if appState.isLoading {
                    HStack {
                        Spacer()
                        ProgressView()
                        Spacer()
                    }
                } else if filteredConversations.isEmpty {
                    Text("No conversations yet")
                        .foregroundColor(.secondary)
                        .italic()
                } else {
                    ForEach(filteredConversations) { conversation in
                        ConversationRow(conversation: conversation)
                            .contentShape(Rectangle())
                            .onTapGesture {
                                appState.selectConversation(conversation)
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                Button(role: .destructive) {
                                    Task {
                                        await appState.deleteConversation(conversation.id)
                                    }
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                            }
                            .swipeActions(edge: .leading) {
                                Button {
                                    editingConversation = conversation
                                    newTitle = conversation.title
                                    showingEditAlert = true
                                } label: {
                                    Label("Edit", systemImage: "pencil")
                                }
                                .tint(.blue)
                            }
                    }
                }
            } header: {
                Text("Conversations")
            }
        }
        .navigationTitle("VibeCaaSChat")
        .searchable(text: $searchText, prompt: "Search conversations")
        .refreshable {
            await appState.refreshConversations()
        }
        .alert("Edit Conversation Title", isPresented: $showingEditAlert) {
            TextField("Title", text: $newTitle)
            Button("Cancel", role: .cancel) {
                editingConversation = nil
                newTitle = ""
            }
            Button("Save") {
                if let conversation = editingConversation {
                    Task {
                        await appState.updateConversationTitle(conversation.id, title: newTitle)
                    }
                }
                editingConversation = nil
                newTitle = ""
            }
        } message: {
            Text("Enter a new title for this conversation")
        }
    }
}

struct ConversationRow: View {
    let conversation: ConversationSidebar
    @EnvironmentObject var appState: AppState
    
    var isSelected: Bool {
        appState.selectedConversation?.id == conversation.id
    }
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(conversation.title)
                    .font(.headline)
                    .lineLimit(2)
                    .foregroundColor(isSelected ? .blue : .primary)
                
                HStack {
                    Image(systemName: "cpu")
                        .font(.caption2)
                    Text(getModelName(conversation.model))
                        .font(.caption)
                    
                    Spacer()
                    
                    Text(formatDate(conversation.updatedAt))
                        .font(.caption)
                }
                .foregroundColor(.secondary)
            }
            
            if isSelected {
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.blue)
                    .font(.caption)
            }
        }
        .padding(.vertical, 4)
    }
    
    private func getModelName(_ modelId: String) -> String {
        appState.models.first(where: { $0.id == modelId })?.displayName ?? modelId
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

#Preview {
    NavigationStack {
        ConversationListView()
            .environmentObject(AppState())
    }
}
