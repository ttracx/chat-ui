import SwiftUI

// MARK: - Button Style
public enum DSButtonVariant {
    case primary
    case secondary
    case tertiary
    case ghost
    case danger
}

public enum DSButtonSize {
    case small
    case medium
    case large
    
    var height: CGFloat {
        switch self {
        case .small: return 32
        case .medium: return 40
        case .large: return 48
        }
    }
    
    var fontSize: Font {
        switch self {
        case .small: return .system(size: 14, weight: .medium)
        case .medium: return .system(size: 16, weight: .medium)
        case .large: return .system(size: 18, weight: .medium)
        }
    }
    
    var horizontalPadding: CGFloat {
        switch self {
        case .small: return 12
        case .medium: return 16
        case .large: return 24
        }
    }
    
    var iconSize: CGFloat {
        switch self {
        case .small: return 16
        case .medium: return 20
        case .large: return 24
        }
    }
}

// MARK: - Button Component
public struct DSButton: View {
    let title: String?
    let icon: Image?
    let iconPosition: IconPosition
    let variant: DSButtonVariant
    let size: DSButtonSize
    let isFullWidth: Bool
    let isLoading: Bool
    let isDisabled: Bool
    let action: () -> Void
    
    public enum IconPosition {
        case leading
        case trailing
    }
    
    public init(
        title: String? = nil,
        icon: Image? = nil,
        iconPosition: IconPosition = .leading,
        variant: DSButtonVariant = .primary,
        size: DSButtonSize = .medium,
        isFullWidth: Bool = false,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.iconPosition = iconPosition
        self.variant = variant
        self.size = size
        self.isFullWidth = isFullWidth
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.action = action
    }
    
    public var body: some View {
        Button(action: {
            if !isDisabled && !isLoading {
                action()
            }
        }) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: foregroundColor))
                        .scaleEffect(0.8)
                } else {
                    if iconPosition == .leading, let icon = icon {
                        icon
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: size.iconSize, height: size.iconSize)
                    }
                    
                    if let title = title {
                        Text(title)
                            .font(size.fontSize)
                            .lineLimit(1)
                    }
                    
                    if iconPosition == .trailing, let icon = icon {
                        icon
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: size.iconSize, height: size.iconSize)
                    }
                }
            }
            .frame(maxWidth: isFullWidth ? .infinity : nil)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .foregroundColor(foregroundColor)
            .background(backgroundColor)
            .cornerRadius(6)
            .overlay(
                RoundedRectangle(cornerRadius: 6)
                    .stroke(borderColor, lineWidth: hasBorder ? 1 : 0)
            )
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1.0)
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.easeInOut(duration: 0.1), value: isPressed)
    }
    
    // MARK: - State
    @State private var isPressed: Bool = false
    
    // MARK: - Colors
    private var backgroundColor: Color {
        switch variant {
        case .primary:
            return DSColors.primary500
        case .secondary:
            return DSColors.secondary500
        case .tertiary:
            return Color.clear
        case .ghost:
            return Color.clear
        case .danger:
            return DSColors.errorMain
        }
    }
    
    private var foregroundColor: Color {
        switch variant {
        case .primary, .secondary, .danger:
            return .white
        case .tertiary:
            return DSColors.primary600
        case .ghost:
            return DSColors.textPrimary
        }
    }
    
    private var borderColor: Color {
        switch variant {
        case .tertiary:
            return DSColors.primary600
        default:
            return Color.clear
        }
    }
    
    private var hasBorder: Bool {
        variant == .tertiary
    }
}

// MARK: - Button Group
public struct DSButtonGroup<Content: View>: View {
    public enum Orientation {
        case horizontal
        case vertical
    }
    
    public enum Spacing {
        case none
        case small
        case medium
        case large
        
        var value: CGFloat {
            switch self {
            case .none: return 0
            case .small: return 8
            case .medium: return 16
            case .large: return 24
            }
        }
    }
    
    let orientation: Orientation
    let spacing: Spacing
    let content: Content
    
    public init(
        orientation: Orientation = .horizontal,
        spacing: Spacing = .small,
        @ViewBuilder content: () -> Content
    ) {
        self.orientation = orientation
        self.spacing = spacing
        self.content = content()
    }
    
    public var body: some View {
        Group {
            if orientation == .horizontal {
                HStack(spacing: spacing.value) {
                    content
                }
            } else {
                VStack(spacing: spacing.value) {
                    content
                }
            }
        }
    }
}

// MARK: - Preview
struct DSButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            DSButton(title: "Primary Button", variant: .primary) {}
            DSButton(title: "Secondary Button", variant: .secondary) {}
            DSButton(title: "Tertiary Button", variant: .tertiary) {}
            DSButton(title: "Ghost Button", variant: .ghost) {}
            DSButton(title: "Danger Button", variant: .danger) {}
            
            DSButton(
                title: "Button with Icon",
                icon: Image(systemName: "star.fill"),
                variant: .primary
            ) {}
            
            DSButton(
                title: "Loading Button",
                variant: .primary,
                isLoading: true
            ) {}
            
            DSButton(
                title: "Disabled Button",
                variant: .primary,
                isDisabled: true
            ) {}
            
            DSButton(
                title: "Full Width Button",
                variant: .primary,
                isFullWidth: true
            ) {}
            
            DSButtonGroup(orientation: .horizontal) {
                DSButton(title: "Cancel", variant: .ghost) {}
                DSButton(title: "Save", variant: .primary) {}
            }
        }
        .padding()
    }
}