# Getting Started with VibeCaaS Design System

Welcome to the VibeCaaS Design System! This guide will help you get started with implementing consistent, accessible, and beautiful user interfaces across all platforms.

## What is a Design System?

A design system is a comprehensive set of standards, components, and guidelines that ensure consistent user experiences across all platforms and touchpoints. The VibeCaaS Design System includes:

- **Design Tokens**: Colors, typography, spacing, and other foundational values
- **Components**: Reusable UI building blocks
- **Patterns**: Interaction and navigation patterns
- **Guidelines**: Accessibility, responsive design, and best practices
- **Assets**: Icons, images, and other resources

## Who Should Use This?

### Designers
- Use Figma files for creating new screens and features
- Reference design tokens for colors, typography, and spacing
- Follow component specifications for consistency
- Review accessibility guidelines

### Developers
- Implement platform-specific components (Web, iOS, Android)
- Use design tokens in your code
- Follow interaction patterns
- Ensure accessibility compliance

### Product Managers
- Understand design patterns and user flows
- Reference screen designs for feature planning
- Ensure consistency across products

## Quick Start by Platform

### Web (React/Svelte/Vue)

#### Installation
```bash
npm install @vibecaas/design-system
# or
yarn add @vibecaas/design-system
```

#### Basic Usage
```javascript
// Import styles
import '@vibecaas/design-system/styles/index.css';

// Import components
import { Button, Input, Card } from '@vibecaas/design-system/svelte';

// Use in your app
<Button variant="primary" on:click={handleClick}>
  Click Me
</Button>
```

#### Learn More
- [Web Platform Guide](../platforms/web/README.md)
- [Component Library](../components/README.md)

### iOS (SwiftUI)

#### Installation
Add to your `Package.swift`:
```swift
dependencies: [
    .package(url: "https://github.com/vibecaas/design-system-ios", from: "1.0.0")
]
```

#### Basic Usage
```swift
import VibeCaaSDesignSystem

struct ContentView: View {
    var body: some View {
        DSButton("Click Me", variant: .primary) {
            // Handle tap
        }
    }
}
```

#### Learn More
- [iOS Platform Guide](../platforms/ios/README.md)
- [SwiftUI Conversion Guide](../automation/swiftui-converter.md)

### Android (Jetpack Compose)

#### Installation
Add to your `build.gradle.kts`:
```kotlin
dependencies {
    implementation("com.vibecaas:design-system:1.0.0")
}
```

#### Basic Usage
```kotlin
import com.vibecaas.designsystem.components.*

@Composable
fun MyScreen() {
    DSButton(
        text = "Click Me",
        onClick = { /* Handle click */ },
        variant = ButtonVariant.Primary
    )
}
```

#### Learn More
- [Android Platform Guide](../platforms/android/README.md)
- [Jetpack Compose Conversion Guide](../automation/jetpack-compose-converter.md)

## Core Concepts

### Design Tokens

Design tokens are the foundational values that define your visual design. They ensure consistency across all platforms.

#### Colors
```css
/* Web */
var(--color-primary-500)

/* iOS */
Color.DS.primary500

/* Android */
DSColor.Primary500
```

#### Typography
```css
/* Web */
var(--font-size-base)

/* iOS */
.dsTextStyle(.body)

/* Android */
MaterialTheme.typography.bodyLarge
```

#### Spacing
```css
/* Web */
var(--spacing-4)

/* iOS */
.ds(.spacing4)

/* Android */
DSSpacing.spacing4
```

[Learn more about Design Tokens](../tokens/README.md)

### Components

Components are reusable UI elements that encapsulate both design and behavior.

#### Button Component
- **Variants**: Primary, Secondary, Tertiary, Destructive
- **Sizes**: Small, Medium, Large
- **States**: Normal, Hover, Pressed, Disabled, Loading

[Explore all components](../components/README.md)

### Responsive Design

All components and screens are designed to work across multiple screen sizes:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

[Learn about responsive patterns](../guidelines/interaction-patterns.md)

### Accessibility

Accessibility is built into every component:

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Color contrast verified
- Touch target sizes optimized

[Read accessibility guidelines](../guidelines/accessibility.md)

## Common Tasks

### Creating a New Screen

1. **Review existing screens** in `/design-system/screens/`
2. **Identify components** you'll need
3. **Use platform-specific implementation**:
   - Web: Svelte/React components
   - iOS: SwiftUI views
   - Android: Jetpack Compose
4. **Follow responsive patterns**
5. **Test accessibility**

[View screen examples](../screens/README.md)

### Adding a New Component

1. **Design the component** following design tokens
2. **Document all states** (normal, hover, pressed, etc.)
3. **Implement for each platform**:
   - Web: Svelte/React/Vue
   - iOS: SwiftUI
   - Android: Jetpack Compose
4. **Add to component library**
5. **Create usage examples**
6. **Test accessibility**

[Component creation guide](./creating-components.md)

### Customizing the Theme

While the design system provides defaults, you can customize:

```css
/* Web - Override CSS variables */
:root {
  --color-primary-500: #8B5CF6; /* Purple instead of blue */
}
```

```swift
// iOS - Override colors in DSTheme
DSTheme.configure(primaryColor: .purple)
```

```kotlin
// Android - Override MaterialTheme colors
MaterialTheme(
    colorScheme = lightColorScheme(
        primary = Color(0xFF8B5CF6)
    )
)
```

## Project Structure

```
design-system/
├── tokens/              # Design tokens (colors, typography, spacing)
├── components/          # Component specifications
├── assets/             # Icons, images, fonts
├── platforms/          # Platform-specific implementations
│   ├── web/           # Web (React, Svelte, Vue)
│   ├── ios/           # iOS (SwiftUI)
│   └── android/       # Android (Jetpack Compose)
├── guidelines/        # Design and interaction guidelines
├── documentation/     # This documentation
├── screens/          # Screen designs and mockups
└── automation/       # Conversion scripts and tools
```

## Resources

### Documentation
- [Component Library](../components/README.md)
- [Design Tokens](../tokens/README.md)
- [Accessibility Guidelines](../guidelines/accessibility.md)
- [Interaction Patterns](../guidelines/interaction-patterns.md)

### Platform Guides
- [Web Platform](../platforms/web/README.md)
- [iOS Platform](../platforms/ios/README.md)
- [Android Platform](../platforms/android/README.md)

### Tools
- [SwiftUI Converter](../automation/swiftui-converter.md)
- [Jetpack Compose Converter](../automation/jetpack-compose-converter.md)

### External Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Support

### Questions?
- Check the [FAQ](./faq.md)
- Review [common issues](./troubleshooting.md)
- Contact the design system team

### Contributing
- Read the [contribution guidelines](./CONTRIBUTING.md)
- Submit issues and feature requests
- Propose new components

## Next Steps

1. **Explore the component library** to see what's available
2. **Review your platform guide** (Web, iOS, or Android)
3. **Check out screen examples** for common patterns
4. **Start building** with the design system!

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-20
