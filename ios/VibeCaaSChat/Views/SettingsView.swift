import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    @State private var localSettings: Settings
    @State private var hasChanges = false
    
    init() {
        _localSettings = State(initialValue: .default)
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Active Model", selection: $localSettings.activeModel) {
                        ForEach(appState.models) { model in
                            Text(model.displayName)
                                .tag(model.id)
                        }
                    }
                    .onChange(of: localSettings.activeModel) { _ in
                        hasChanges = true
                    }
                } header: {
                    Text("Model Selection")
                } footer: {
                    if let model = appState.models.first(where: { $0.id == localSettings.activeModel }) {
                        VStack(alignment: .leading, spacing: 8) {
                            if let description = model.description {
                                Text(description)
                                    .font(.caption)
                            }
                            if let url = model.websiteUrl {
                                Link("Learn more", destination: URL(string: url)!)
                                    .font(.caption)
                            }
                        }
                    }
                }
                
                Section {
                    if let model = appState.models.first(where: { $0.id == localSettings.activeModel }) {
                        NavigationLink {
                            CustomPromptEditor(
                                modelId: model.id,
                                modelName: model.displayName,
                                customPrompts: $localSettings.customPrompts,
                                defaultPrompt: model.preprompt ?? "",
                                hasChanges: $hasChanges
                            )
                        } label: {
                            VStack(alignment: .leading) {
                                Text("Custom System Prompt")
                                if let prompt = localSettings.customPrompts[model.id], !prompt.isEmpty {
                                    Text(prompt)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                        .lineLimit(2)
                                }
                            }
                        }
                    }
                } header: {
                    Text("Model Configuration")
                }
                
                Section {
                    Toggle("Share Conversations", isOn: $localSettings.shareConversationsWithModelAuthors)
                        .onChange(of: localSettings.shareConversationsWithModelAuthors) { _ in
                            hasChanges = true
                        }
                    
                    Toggle("Disable Streaming", isOn: $localSettings.disableStream)
                        .onChange(of: localSettings.disableStream) { _ in
                            hasChanges = true
                        }
                    
                    Toggle("Direct Paste", isOn: $localSettings.directPaste)
                        .onChange(of: localSettings.directPaste) { _ in
                            hasChanges = true
                        }
                } header: {
                    Text("Preferences")
                } footer: {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Share Conversations: Help improve models by sharing your conversations with model authors")
                        Text("Disable Streaming: Show complete responses instead of streaming")
                        Text("Direct Paste: Paste images directly without confirmation")
                    }
                    .font(.caption)
                }
                
                if let user = appState.user, user.loggedIn {
                    Section {
                        if let username = user.username {
                            HStack {
                                Text("Username")
                                Spacer()
                                Text(username)
                                    .foregroundColor(.secondary)
                            }
                        }
                        if let email = user.email {
                            HStack {
                                Text("Email")
                                Spacer()
                                Text(email)
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        Button("Sign Out", role: .destructive) {
                            // Implement sign out
                        }
                    } header: {
                        Text("Account")
                    }
                }
                
                Section {
                    if let config = appState.publicConfig {
                        HStack {
                            Text("App Name")
                            Spacer()
                            Text(config.PUBLIC_APP_NAME)
                                .foregroundColor(.secondary)
                        }
                        
                        HStack {
                            Text("Version")
                            Spacer()
                            Text("1.0.0")
                                .foregroundColor(.secondary)
                        }
                    }
                } header: {
                    Text("About")
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        Task {
                            await appState.updateSettings(localSettings)
                            dismiss()
                        }
                    }
                    .disabled(!hasChanges)
                }
            }
            .onAppear {
                localSettings = appState.settings
                hasChanges = false
            }
        }
    }
}

struct CustomPromptEditor: View {
    let modelId: String
    let modelName: String
    @Binding var customPrompts: [String: String]
    let defaultPrompt: String
    @Binding var hasChanges: Bool
    
    @State private var promptText: String = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Customize the system prompt for \(modelName)")
                .font(.headline)
                .padding(.horizontal)
            
            if !defaultPrompt.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Default Prompt:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text(defaultPrompt)
                        .font(.caption)
                        .padding(8)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                }
                .padding(.horizontal)
            }
            
            TextEditor(text: $promptText)
                .font(.body)
                .padding(8)
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.horizontal)
                .onChange(of: promptText) { _ in
                    hasChanges = true
                }
            
            HStack {
                Button("Reset to Default") {
                    promptText = defaultPrompt
                    customPrompts[modelId] = nil
                }
                .disabled(promptText == defaultPrompt || (promptText.isEmpty && defaultPrompt.isEmpty))
                
                Spacer()
                
                Button("Clear") {
                    promptText = ""
                    customPrompts[modelId] = nil
                }
                .disabled(promptText.isEmpty)
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .navigationTitle("Custom Prompt")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            promptText = customPrompts[modelId] ?? defaultPrompt
        }
        .onDisappear {
            if !promptText.isEmpty && promptText != defaultPrompt {
                customPrompts[modelId] = promptText
            } else if promptText.isEmpty {
                customPrompts[modelId] = nil
            }
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(AppState())
}
