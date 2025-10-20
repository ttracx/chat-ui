# iOS Platform Implementation

Design system implementation for iOS applications using SwiftUI.

## Installation

### Swift Package Manager
```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/vibecaas/design-system-ios", from: "1.0.0")
]
```

### Xcode
1. File → Add Packages
2. Enter repository URL: `https://github.com/vibecaas/design-system-ios`
3. Select version and add to target

## Setup

### Import Framework
```swift
import VibeCaaSDesignSystem
```

### Configure Theme
```swift
// AppDelegate.swift or App.swift
@main
struct VibeCaaSApp: App {
    init() {
        DSTheme.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.dsTheme, .light)
        }
    }
}
```

## Design Tokens

### Colors
```swift
// Access colors from design system
Color.ds(.primary500)
Color.ds(.neutral900)
Color.ds(.semanticSuccess)

// Or use the DSColor enum directly
DSColor.primary500.color
DSColor.neutral0.color

// UIKit compatibility
UIColor.ds(.primary500)
```

### Typography
```swift
// Text styles
Text("Heading")
    .dsTextStyle(.h1)

Text("Body text")
    .dsTextStyle(.body)

Text("Caption")
    .dsTextStyle(.caption)

// Custom font configuration
Text("Custom")
    .font(.ds(.title, weight: .bold))
    .foregroundColor(.ds(.primary600))
```

### Spacing
```swift
// Padding
VStack(spacing: .ds(.spacing4)) {
    Text("Item 1")
    Text("Item 2")
}
.padding(.ds(.spacing6))

// Direct values
let padding: CGFloat = .ds(.spacing4) // 16px
let margin: CGFloat = .ds(.spacing8) // 32px
```

### Effects
```swift
// Shadows
Text("Shadowed")
    .dsShadow(.md)

// Border radius
Rectangle()
    .cornerRadius(.ds(.radiusLg))

// Blur
Image("background")
    .blur(radius: .ds(.blurSm))
```

## Components

### DSButton
```swift
// Primary button
DSButton(
    "Submit",
    variant: .primary,
    size: .medium,
    action: handleSubmit
)

// With icon
DSButton(
    "Add Item",
    variant: .primary,
    icon: Image(systemName: "plus"),
    action: handleAdd
)

// Loading state
DSButton(
    "Processing...",
    variant: .primary,
    isLoading: isProcessing,
    action: handleProcess
)

// Disabled
DSButton(
    "Submit",
    variant: .primary,
    disabled: !isValid,
    action: handleSubmit
)

// Full width
DSButton(
    "Continue",
    variant: .primary,
    fullWidth: true,
    action: handleContinue
)
```

### DSTextField
```swift
@State private var email = ""
@State private var emailError: String? = nil

DSTextField(
    "Email Address",
    text: $email,
    placeholder: "you@example.com",
    keyboardType: .emailAddress,
    error: emailError,
    helperText: "We'll never share your email"
)
.onSubmit {
    validateEmail()
}

// With icon
DSTextField(
    "Search",
    text: $searchQuery,
    icon: Image(systemName: "magnifyingglass")
)

// Secure entry
DSTextField(
    "Password",
    text: $password,
    isSecure: true,
    showVisibilityToggle: true
)
```

### DSCard
```swift
DSCard(variant: .elevated) {
    VStack(alignment: .leading, spacing: .ds(.spacing4)) {
        Text("Card Title")
            .dsTextStyle(.h4)
        
        Text("Card description goes here...")
            .dsTextStyle(.body)
            .foregroundColor(.ds(.neutral600))
        
        HStack {
            Spacer()
            DSButton("Action", variant: .primary) {
                // Handle action
            }
        }
    }
}

// Interactive card
DSCard(variant: .interactive) {
    // Content
}
.onTapGesture {
    handleCardTap()
}
```

### DSModal
```swift
@State private var showModal = false

var body: some View {
    VStack {
        DSButton("Open Modal", variant: .primary) {
            showModal = true
        }
    }
    .dsModal(
        isPresented: $showModal,
        title: "Confirm Action"
    ) {
        VStack(spacing: .ds(.spacing4)) {
            Text("Are you sure you want to continue?")
                .dsTextStyle(.body)
            
            HStack(spacing: .ds(.spacing3)) {
                DSButton("Cancel", variant: .secondary) {
                    showModal = false
                }
                
                DSButton("Confirm", variant: .primary) {
                    handleConfirm()
                    showModal = false
                }
            }
        }
    }
}
```

### DSList
```swift
struct User: Identifiable {
    let id: UUID
    let name: String
    let email: String
}

DSList(users) { user in
    DSListRow {
        VStack(alignment: .leading, spacing: .ds(.spacing1)) {
            Text(user.name)
                .dsTextStyle(.bodyLarge)
            
            Text(user.email)
                .dsTextStyle(.bodySmall)
                .foregroundColor(.ds(.neutral600))
        }
    }
    .onTapGesture {
        selectUser(user)
    }
}
.listStyle(.plain)
```

### DSNavigationBar
```swift
NavigationView {
    ContentView()
        .dsNavigationBar(
            title: "Home",
            leftButton: DSNavBarButton(
                icon: Image(systemName: "line.3.horizontal"),
                action: toggleMenu
            ),
            rightButtons: [
                DSNavBarButton(
                    icon: Image(systemName: "magnifyingglass"),
                    action: openSearch
                ),
                DSNavBarButton(
                    icon: Image(systemName: "person.circle"),
                    action: openProfile
                )
            ]
        )
}
```

### DSTabBar
```swift
@State private var selectedTab: Tab = .home

enum Tab {
    case home, search, notifications, profile
}

TabView(selection: $selectedTab) {
    HomeView()
        .dsTab(.home, label: "Home", icon: "house")
    
    SearchView()
        .dsTab(.search, label: "Search", icon: "magnifyingglass")
    
    NotificationsView()
        .dsTab(.notifications, label: "Alerts", icon: "bell")
    
    ProfileView()
        .dsTab(.profile, label: "Profile", icon: "person")
}
```

## Layouts

### DSStack
```swift
// Vertical stack with design system spacing
DSVStack(spacing: .spacing4) {
    Text("Item 1")
    Text("Item 2")
    Text("Item 3")
}

// Horizontal stack
DSHStack(spacing: .spacing3) {
    Image(systemName: "checkmark")
    Text("Completed")
}

// Grid layout
DSGrid(columns: 2, spacing: .spacing4) {
    ForEach(items) { item in
        ItemCard(item)
    }
}
```

### DSContainer
```swift
DSContainer(maxWidth: .lg) {
    VStack(spacing: .ds(.spacing6)) {
        // Content automatically constrained to max width
        // with responsive padding
    }
}
```

## Animations

### Transitions
```swift
Text("Animated")
    .dsTransition(.fade, duration: .normal)

// Slide in
View()
    .dsTransition(.slideUp)

// Scale
View()
    .dsTransition(.scale)
```

### Microinteractions
```swift
DSButton("Press Me", variant: .primary) {
    // Action
}
.dsButtonPressEffect() // Adds scale-down on press

Image("icon")
    .dsHoverLift() // Lifts on hover (iPad with pointer)
```

### Custom Animations
```swift
@State private var isAnimating = false

Circle()
    .fill(Color.ds(.primary500))
    .frame(width: 50, height: 50)
    .scaleEffect(isAnimating ? 1.2 : 1.0)
    .animation(.ds(.easeOut, duration: .normal), value: isAnimating)
```

## Dark Mode

### Automatic Support
```swift
// Design system colors automatically adapt to dark mode
Color.ds(.neutral0) // White in light, dark in dark mode
Color.ds(.neutral900) // Dark in light, light in dark mode
```

### Manual Override
```swift
ContentView()
    .preferredColorScheme(.dark) // Force dark mode
    .preferredColorScheme(.light) // Force light mode
```

### Custom Dark Mode Handling
```swift
@Environment(\.colorScheme) var colorScheme

var body: some View {
    VStack {
        if colorScheme == .dark {
            DarkModeView()
        } else {
            LightModeView()
        }
    }
}
```

## Accessibility

### VoiceOver
```swift
DSButton("Delete", variant: .destructive) {
    handleDelete()
}
.accessibilityLabel("Delete item")
.accessibilityHint("Double tap to delete this item permanently")

// Custom accessibility
Image(systemName: "star.fill")
    .accessibilityLabel("Favorite")
    .accessibilityAddTraits(.isButton)
```

### Dynamic Type
```swift
// All DSTextStyle automatically supports Dynamic Type
Text("Scales with user preference")
    .dsTextStyle(.body)

// Custom scaling
Text("Custom")
    .font(.system(.body))
    .dynamicTypeSize(.small ... .xxxLarge)
```

### Color Contrast
```swift
// Design system ensures WCAG AA compliance
// Check contrast in code
DSColor.primary500.contrastRatio(with: .neutral0) // Returns ratio
```

### Reduce Motion
```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

var animation: Animation {
    reduceMotion ? .none : .ds(.easeOut, duration: .normal)
}
```

## Responsive Design

### Size Classes
```swift
@Environment(\.horizontalSizeClass) var horizontalSizeClass
@Environment(\.verticalSizeClass) var verticalSizeClass

var body: some View {
    if horizontalSizeClass == .compact {
        // iPhone portrait layout
        CompactLayout()
    } else {
        // iPad or iPhone landscape layout
        RegularLayout()
    }
}
```

### Device-Specific Layouts
```swift
if UIDevice.current.userInterfaceIdiom == .pad {
    // iPad layout
    iPadLayout()
} else {
    // iPhone layout
    iPhoneLayout()
}
```

## Best Practices

### Do ✓
- Use SwiftUI native components when possible
- Leverage design system tokens
- Support Dynamic Type and VoiceOver
- Test on multiple device sizes
- Follow Apple Human Interface Guidelines
- Use SF Symbols for icons
- Implement proper focus management
- Test in both light and dark modes

### Don't ✗
- Hard-code colors or spacing values
- Override accessibility settings
- Ignore safe areas
- Create custom components unnecessarily
- Block main thread with heavy operations
- Forget to handle edge cases
- Skip iPad layouts
- Ignore system settings (reduce motion, etc.)

## Code Examples

### Complete Form
```swift
struct SignUpForm: View {
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var agreedToTerms = false
    @State private var isLoading = false
    
    var body: some View {
        DSContainer {
            DSVStack(spacing: .spacing6) {
                Text("Create Account")
                    .dsTextStyle(.h1)
                
                DSTextField(
                    "Full Name",
                    text: $name,
                    placeholder: "John Doe"
                )
                
                DSTextField(
                    "Email",
                    text: $email,
                    placeholder: "you@example.com",
                    keyboardType: .emailAddress
                )
                
                DSTextField(
                    "Password",
                    text: $password,
                    isSecure: true,
                    showVisibilityToggle: true
                )
                
                DSCheckbox(
                    "I agree to the Terms and Conditions",
                    isChecked: $agreedToTerms
                )
                
                DSButton(
                    "Sign Up",
                    variant: .primary,
                    size: .large,
                    fullWidth: true,
                    isLoading: isLoading,
                    disabled: !isFormValid
                ) {
                    handleSignUp()
                }
            }
            .padding(.ds(.spacing6))
        }
    }
    
    var isFormValid: Bool {
        !name.isEmpty && !email.isEmpty && 
        !password.isEmpty && agreedToTerms
    }
    
    func handleSignUp() {
        isLoading = true
        // API call
    }
}
```

## Related Documentation
- [Component Library](../../components/README.md)
- [Design Tokens](../../tokens/README.md)
- [Accessibility Guidelines](../../guidelines/accessibility.md)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
