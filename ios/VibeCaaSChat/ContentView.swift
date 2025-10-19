import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @State private var showingSettings = false
    @State private var showingModels = false
    
    var body: some View {
        NavigationSplitView {
            ConversationListView()
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Menu {
                            Button(action: { showingModels = true }) {
                                Label("Models", systemImage: "cpu")
                            }
                            Button(action: { showingSettings = true }) {
                                Label("Settings", systemImage: "gear")
                            }
                        } label: {
                            Image(systemName: "ellipsis.circle")
                        }
                    }
                }
        } detail: {
            if let selectedConversation = appState.selectedConversation {
                ChatView(conversationId: selectedConversation.id)
            } else {
                VStack(spacing: 20) {
                    Image(systemName: "message.badge")
                        .font(.system(size: 60))
                        .foregroundColor(.gray)
                    Text("Select a conversation or start a new chat")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    
                    Button(action: { appState.createNewConversation() }) {
                        Label("New Chat", systemImage: "plus.message")
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                }
            }
        }
        .sheet(isPresented: $showingSettings) {
            SettingsView()
        }
        .sheet(isPresented: $showingModels) {
            ModelsView()
        }
        .task {
            await appState.initialize()
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}
