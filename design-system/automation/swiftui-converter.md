# SwiftUI Conversion Guide and Prompts

Automated conversion of designs to SwiftUI code for iOS applications.

## Overview

This document provides prompts and scripts for converting design system components and screens into production-ready SwiftUI code.

## Design-to-Code Conversion Prompts

### Component Conversion Prompt

```markdown
Convert the following design specification to SwiftUI code following these requirements:

**Component**: [Component Name]
**Variant**: [e.g., Primary Button, Text Input, Card]

**Design Specifications**:
- Colors: [List colors from design tokens]
- Typography: [Font family, size, weight]
- Spacing: [Padding, margins, gaps]
- Border Radius: [Corner radius values]
- Shadows: [Shadow specifications]
- States: [Normal, hover, pressed, disabled, etc.]

**Requirements**:
1. Use design system tokens (DSColor, DSSpacing, etc.)
2. Support all states with proper animations
3. Include accessibility attributes (VoiceOver, Dynamic Type)
4. Follow SwiftUI best practices (state management, view composition)
5. Make reusable and configurable
6. Add inline documentation
7. Support both light and dark modes
8. Include usage example

**Expected Output**:
- SwiftUI view struct
- Required properties and bindings
- All state variations
- Accessibility support
- Usage example
```

### Screen Conversion Prompt

```markdown
Convert the following screen design to SwiftUI implementation:

**Screen**: [Screen Name, e.g., Login, Dashboard]
**Platform**: iOS
**Device**: [iPhone, iPad, or Universal]
**Layout**: [Describe layout structure]

**Screen Components**:
[List all components used, e.g., Navigation Bar, TextField, Button, Card]

**Layout Structure**:
```
[Provide ASCII layout or description]
```

**Data Requirements**:
- State variables: [List all @State properties]
- View models: [List required view models]
- Data models: [List data structures]

**Interactions**:
[List all user interactions: tap, swipe, navigation, etc.]

**Navigation**:
[Describe navigation pattern: push, modal, sheet, etc.]

**Requirements**:
1. Use design system components (DS prefix)
2. Implement proper state management
3. Handle loading and error states
4. Support iPad with adaptive layout
5. Include navigation setup
6. Add accessibility labels
7. Support dark mode
8. Follow iOS Human Interface Guidelines

**Expected Output**:
- Main view struct
- View model (if needed)
- Data models
- Navigation setup
- Complete, runnable code
```

## Conversion Scripts

### Automated Token Extractor

```python
#!/usr/bin/env python3
"""
Extract design tokens from JSON and generate SwiftUI constants.

Usage: python3 extract_tokens.py tokens/colors.json > DSColor.swift
"""

import json
import sys

def generate_swiftui_colors(colors_json):
    """Generate SwiftUI Color extension from colors.json"""
    
    with open(colors_json, 'r') as f:
        data = json.load(f)
    
    output = """//
// DSColor.swift
// Auto-generated from design tokens
// Do not edit manually
//

import SwiftUI

extension Color {
    enum DS {
"""
    
    # Primary colors
    for shade, info in data['colors']['primary'].items():
        color_name = f"primary{shade.title()}"
        hex_value = info['value']
        output += f"        static let {color_name} = Color(hex: \"{hex_value}\")\n"
    
    output += "\n"
    
    # Neutral colors
    for shade, info in data['colors']['neutral'].items():
        color_name = f"neutral{shade.title()}"
        hex_value = info['value']
        output += f"        static let {color_name} = Color(hex: \"{hex_value}\")\n"
    
    output += "\n"
    
    # Semantic colors
    for category, shades in data['colors']['semantic'].items():
        for shade, hex_value in shades.items():
            if shade != 'description' and shade != 'contrast':
                color_name = f"{category}{shade.title()}"
                output += f"        static let {color_name} = Color(hex: \"{hex_value}\")\n"
    
    output += """    }
}

// Helper extension for hex colors
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
"""
    
    return output

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_tokens.py tokens/colors.json")
        sys.exit(1)
    
    print(generate_swiftui_colors(sys.argv[1]))
```

### Component Generator

```python
#!/usr/bin/env python3
"""
Generate SwiftUI component from specification.

Usage: python3 generate_component.py button.spec.json > DSButton.swift
"""

import json
import sys

def generate_button_component(spec):
    """Generate SwiftUI button component from spec"""
    
    with open(spec, 'r') as f:
        data = json.load(f)
    
    return f"""//
// DSButton.swift
// Design System Button Component
//

import SwiftUI

struct DSButton: View {{
    // MARK: - Properties
    let title: String
    let action: () -> Void
    var variant: Variant = .primary
    var size: Size = .medium
    var icon: Image? = nil
    var iconPosition: IconPosition = .left
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var fullWidth: Bool = false
    
    // MARK: - Types
    enum Variant {{
        case primary, secondary, tertiary, destructive
    }}
    
    enum Size {{
        case small, medium, large
    }}
    
    enum IconPosition {{
        case left, right
    }}
    
    // MARK: - Body
    var body: some View {{
        Button(action: action) {{
            HStack(spacing: spacing) {{
                if let icon = icon, iconPosition == .left, !isLoading {{
                    icon
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: iconSize, height: iconSize)
                }}
                
                if isLoading {{
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: textColor))
                        .scaleEffect(0.8)
                }} else {{
                    Text(title)
                        .font(font)
                        .fontWeight(fontWeight)
                }}
                
                if let icon = icon, iconPosition == .right, !isLoading {{
                    icon
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: iconSize, height: iconSize)
                }}
            }}
            .foregroundColor(textColor)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .frame(height: height)
            .padding(.horizontal, horizontalPadding)
            .background(backgroundColor)
            .cornerRadius(cornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
        }}
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.6 : 1.0)
        .buttonStyle(DSButtonStyle())
        .accessibilityLabel(title)
        .accessibilityHint(isLoading ? "Loading" : "")
        .accessibilityAddTraits(isDisabled ? [.isButton, .isNotEnabled] : .isButton)
    }}
    
    // MARK: - Computed Properties
    
    private var height: CGFloat {{
        switch size {{
        case .small: return 32
        case .medium: return 40
        case .large: return 48
        }}
    }}
    
    private var horizontalPadding: CGFloat {{
        switch size {{
        case .small: return 16
        case .medium: return 24
        case .large: return 32
        }}
    }}
    
    private var spacing: CGFloat {{
        8
    }}
    
    private var iconSize: CGFloat {{
        switch size {{
        case .small: return 16
        case .medium: return 20
        case .large: return 24
        }}
    }}
    
    private var font: Font {{
        switch size {{
        case .small: return .system(size: 14)
        case .medium: return .system(size: 16)
        case .large: return .system(size: 18)
        }}
    }}
    
    private var fontWeight: Font.Weight {{
        .semibold
    }}
    
    private var cornerRadius: CGFloat {{
        6
    }}
    
    private var backgroundColor: Color {{
        switch variant {{
        case .primary:
            return Color.DS.primary500
        case .secondary:
            return .clear
        case .tertiary:
            return .clear
        case .destructive:
            return Color.DS.semanticError500
        }}
    }}
    
    private var textColor: Color {{
        switch variant {{
        case .primary, .destructive:
            return Color.DS.neutral0
        case .secondary, .tertiary:
            return Color.DS.primary600
        }}
    }}
    
    private var borderColor: Color {{
        switch variant {{
        case .primary, .tertiary, .destructive:
            return .clear
        case .secondary:
            return Color.DS.primary600
        }}
    }}
    
    private var borderWidth: CGFloat {{
        variant == .secondary ? 2 : 0
    }}
}}

// MARK: - Button Style
struct DSButtonStyle: ButtonStyle {{
    func makeBody(configuration: Configuration) -> some View {{
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }}
}}

// MARK: - Preview
struct DSButton_Previews: PreviewProvider {{
    static var previews: some View {{
        VStack(spacing: 20) {{
            // Primary
            DSButton(title: "Primary Button", action: {{}}, variant: .primary)
            
            // Secondary
            DSButton(title: "Secondary Button", action: {{}}, variant: .secondary)
            
            // With icon
            DSButton(
                title: "With Icon",
                action: {{}},
                variant: .primary,
                icon: Image(systemName: "plus")
            )
            
            // Loading
            DSButton(
                title: "Loading",
                action: {{}},
                variant: .primary,
                isLoading: true
            )
            
            // Disabled
            DSButton(
                title: "Disabled",
                action: {{}},
                variant: .primary,
                isDisabled: true
            )
            
            // Sizes
            DSButton(title: "Small", action: {{}}, size: .small)
            DSButton(title: "Medium", action: {{}}, size: .medium)
            DSButton(title: "Large", action: {{}}, size: .large)
        }}
        .padding()
        .previewLayout(.sizeThatFits)
    }}
}}
"""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_component.py button.spec.json")
        sys.exit(1)
    
    print(generate_button_component(sys.argv[1]))
```

## AI Conversion Prompts

### Complete Screen to SwiftUI

```
I need to convert a [SCREEN_NAME] screen design to SwiftUI. Here are the details:

**Layout**:
[Paste layout description or ASCII diagram]

**Components**:
1. Navigation bar with title "[TITLE]" and [buttons]
2. [List all components]

**Color Scheme**:
- Background: [color]
- Primary: [color]
- Text: [color]

**Functionality**:
- [List all interactions]
- [List all state changes]
- [List all navigation flows]

Please generate:
1. Main view struct with proper state management
2. View model if needed for complex logic
3. Navigation setup (NavigationView, NavigationLink, etc.)
4. All subviews as separate structs
5. Preview provider with sample data
6. Accessibility support
7. iPad layout adaptations

Use the VibeCaaS Design System components (DSButton, DSTextField, DSCard, etc.) and follow SwiftUI best practices.
```

### Figma to SwiftUI Conversion

```
Convert this Figma design to SwiftUI:

**Figma Link**: [URL]
**Frame**: [Frame name]
**Platform**: iOS (iPhone/iPad)

**Design Tokens to Use**:
- Colors: From design-system/tokens/colors.json
- Typography: From design-system/tokens/typography.json
- Spacing: From design-system/tokens/spacing.json

**Requirements**:
1. Extract all colors, fonts, and spacing from design
2. Map to design system tokens
3. Create SwiftUI views using DS components
4. Implement all states visible in Figma
5. Add animations for transitions
6. Support dark mode
7. Include accessibility

Output format:
- File structure
- All SwiftUI files
- Asset catalog entries needed
- Installation/integration instructions
```

## Usage Examples

### Convert Button Design
```bash
# Extract design tokens
python3 automation/extract_tokens.py design-system/tokens/colors.json > ios/VibeCaaSChat/DesignSystem/DSColor.swift

# Generate button component
python3 automation/generate_component.py design-system/components/button.spec.json > ios/VibeCaaSChat/DesignSystem/DSButton.swift
```

### AI-Assisted Conversion
```
Using ChatGPT/Claude:

1. Provide this document as context
2. Share screen design (image or Figma link)
3. Use conversion prompt above
4. Review and refine generated code
5. Test on simulator/device
6. Integrate into project
```

## Best Practices

### Do ✓
- Use design system components
- Follow SwiftUI conventions
- Support all device sizes
- Include accessibility
- Add previews for all states
- Document complex logic
- Use @State and @Binding properly
- Support dark mode

### Don't ✗
- Hard-code colors or spacing
- Skip accessibility attributes
- Forget iPad layouts
- Ignore platform guidelines
- Create deeply nested views
- Skip error handling
- Use deprecated APIs

## Related Documentation
- [iOS Platform Guide](../platforms/ios/README.md)
- [Component Library](../components/README.md)
- [Design Tokens](../tokens/README.md)
