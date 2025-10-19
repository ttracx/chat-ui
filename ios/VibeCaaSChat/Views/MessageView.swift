import SwiftUI

struct MessageView: View {
    let message: Message
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            if message.from == .user {
                Spacer()
            }
            
            VStack(alignment: message.from == .user ? .trailing : .leading, spacing: 8) {
                // Message bubble
                VStack(alignment: .leading, spacing: 8) {
                    Text(message.content)
                        .textSelection(.enabled)
                        .font(.body)
                        .foregroundColor(message.from == .user ? .white : .primary)
                    
                    if let files = message.files, !files.isEmpty {
                        ForEach(files, id: \.name) { file in
                            HStack {
                                Image(systemName: "paperclip")
                                    .font(.caption)
                                Text(file.name)
                                    .font(.caption)
                            }
                            .foregroundColor(message.from == .user ? .white.opacity(0.8) : .secondary)
                        }
                    }
                }
                .padding(12)
                .background(message.from == .user ? Color.blue : Color(.systemGray6))
                .cornerRadius(16)
                
                // Timestamp
                if let createdAt = message.createdAt {
                    Text(formatDate(createdAt))
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .frame(maxWidth: UIScreen.main.bounds.width * 0.75, alignment: message.from == .user ? .trailing : .leading)
            
            if message.from == .assistant {
                Spacer()
            }
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        let calendar = Calendar.current
        
        if calendar.isDateInToday(date) {
            formatter.dateFormat = "h:mm a"
        } else if calendar.isDateInYesterday(date) {
            return "Yesterday"
        } else {
            formatter.dateFormat = "MMM d, h:mm a"
        }
        
        return formatter.string(from: date)
    }
}

#Preview {
    VStack(spacing: 16) {
        MessageView(message: Message(
            id: "1",
            from: .user,
            content: "Hello! How are you?",
            createdAt: Date()
        ))
        
        MessageView(message: Message(
            id: "2",
            from: .assistant,
            content: "I'm doing great! How can I help you today?",
            createdAt: Date()
        ))
    }
    .padding()
}
