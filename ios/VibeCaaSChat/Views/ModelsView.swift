import SwiftUI

struct ModelsView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    @State private var searchText = ""
    
    var filteredModels: [Model] {
        if searchText.isEmpty {
            return appState.models
        } else {
            return appState.models.filter { model in
                model.displayName.localizedCaseInsensitiveContains(searchText) ||
                (model.description?.localizedCaseInsensitiveContains(searchText) ?? false)
            }
        }
    }
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredModels) { model in
                    ModelRow(model: model)
                }
            }
            .navigationTitle("Models")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Search models")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct ModelRow: View {
    let model: Model
    @EnvironmentObject var appState: AppState
    
    var isActive: Bool {
        appState.settings.activeModel == model.id
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(model.displayName)
                        .font(.headline)
                        .foregroundColor(isActive ? .blue : .primary)
                    
                    HStack(spacing: 8) {
                        if model.multimodal {
                            Label("Multimodal", systemImage: "photo")
                                .font(.caption2)
                                .foregroundColor(.blue)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.blue.opacity(0.1))
                                .cornerRadius(4)
                        }
                        
                        if let parameters = model.parameters {
                            if let temp = parameters.temperature {
                                Text("Temp: \(String(format: "%.1f", temp))")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                            if let maxTokens = parameters.maxNewTokens {
                                Text("Max tokens: \(maxTokens)")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
                
                Spacer()
                
                if isActive {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.blue)
                }
            }
            
            if let description = model.description {
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }
            
            if let websiteUrl = model.websiteUrl, let url = URL(string: websiteUrl) {
                Link(destination: url) {
                    HStack {
                        Text("Learn more")
                            .font(.caption)
                        Image(systemName: "arrow.up.right.square")
                            .font(.caption2)
                    }
                }
            }
        }
        .padding(.vertical, 4)
        .contentShape(Rectangle())
        .onTapGesture {
            Task {
                var newSettings = appState.settings
                newSettings.activeModel = model.id
                await appState.updateSettings(newSettings)
            }
        }
    }
}

#Preview {
    ModelsView()
        .environmentObject(AppState())
}
