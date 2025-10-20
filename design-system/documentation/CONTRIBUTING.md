# Contributing to VibeCaaS Design System

Thank you for your interest in contributing to the VibeCaaS Design System! This document provides guidelines for contributing new components, improvements, and fixes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Component Development](#component-development)
- [Design Token Updates](#design-token-updates)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and professional
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

- **Design**: Figma account with access to design files
- **Web**: Node.js 18+, npm/yarn/pnpm
- **iOS**: Xcode 15+, Swift 5.9+
- **Android**: Android Studio, Kotlin 1.9+

### Development Setup

```bash
# Clone the repository
git clone https://github.com/vibecaas/design-system.git

# Navigate to the design system directory
cd design-system

# Install dependencies (if applicable for your platform)
npm install  # For web
```

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide context**: Screenshots, code samples, expected vs actual behavior
4. **Label appropriately**: bug, enhancement, documentation, etc.

### Suggesting Enhancements

To suggest a new feature or component:

1. **Check if it already exists** or is planned
2. **Describe the use case** clearly
3. **Provide examples** or mockups if possible
4. **Consider accessibility** and platform support

### Pull Requests

We welcome pull requests for:

- Bug fixes
- New components
- Component improvements
- Documentation updates
- Design token additions
- Accessibility improvements

## Component Development

### Creating a New Component

#### 1. Design Phase

**Create Figma Design**:
- Follow existing component structure
- Define all states (normal, hover, pressed, disabled, error, success)
- Ensure accessibility (contrast, touch targets)
- Get design review approval

**Document Specifications**:
```markdown
# [Component Name]

## Purpose
[Brief description of component purpose]

## Variants
- Variant 1: [Description]
- Variant 2: [Description]

## States
- Normal
- Hover
- Pressed
- Disabled
- Error
- Success

## Sizes
- Small: [Dimensions]
- Medium: [Dimensions]
- Large: [Dimensions]

## Accessibility
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Minimum contrast ratios
```

#### 2. Implementation Phase

**Web Implementation**:
```bash
# Create component file
touch design-system/platforms/web/components/MyComponent.svelte

# Create documentation
touch design-system/components/MyComponent.md
```

**iOS Implementation**:
```bash
# Create SwiftUI component
touch design-system/platforms/ios/Components/DSMyComponent.swift
```

**Android Implementation**:
```bash
# Create Jetpack Compose component
touch design-system/platforms/android/components/DSMyComponent.kt
```

#### 3. Component Checklist

Before submitting a new component, ensure:

- [ ] Designed in Figma with all states
- [ ] Documented in `/components/[ComponentName].md`
- [ ] Implemented for all platforms (Web, iOS, Android)
- [ ] Uses design tokens (no hard-coded values)
- [ ] Accessibility compliant (WCAG 2.1 AA)
- [ ] Responsive across screen sizes
- [ ] Dark mode support
- [ ] Loading and error states (if applicable)
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Preview/example provided
- [ ] Peer review completed

### Component API Design

#### Consistent Naming

```javascript
// Web (Svelte/React)
<Button variant="primary" size="medium" loading={false} />

// iOS (SwiftUI)
DSButton("Text", variant: .primary, size: .medium, isLoading: false)

// Android (Jetpack Compose)
DSButton(text = "Text", variant = ButtonVariant.Primary, size = ButtonSize.Medium, loading = false)
```

#### Required vs Optional Props

- **Required**: Content (text, children), action handlers
- **Optional**: Variants, sizes, states, icons
- **Defaults**: Provide sensible defaults (primary variant, medium size)

#### Prop Validation

```javascript
// Web - TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// iOS - Swift
enum ButtonVariant {
  case primary, secondary, tertiary, destructive
}

// Android - Kotlin
enum class ButtonVariant {
  Primary, Secondary, Tertiary, Destructive
}
```

## Design Token Updates

### Adding New Tokens

1. **Update JSON files** in `/design-system/tokens/`
2. **Regenerate platform files**:
   ```bash
   npm run generate-tokens
   ```
3. **Update documentation**
4. **Test on all platforms**

### Token Naming Convention

```json
{
  "category": {
    "subcategory": {
      "variant": {
        "value": "#0EA5E9",
        "description": "Primary brand color"
      }
    }
  }
}
```

Example:
```json
{
  "colors": {
    "primary": {
      "500": {
        "value": "#0EA5E9",
        "description": "Base primary color"
      }
    }
  }
}
```

## Documentation

### Writing Documentation

Good documentation includes:

- **Purpose**: What the component does
- **Usage**: When and how to use it
- **Examples**: Code samples for all platforms
- **Props/Parameters**: Complete API reference
- **Accessibility**: ARIA attributes, keyboard navigation
- **Best practices**: Do's and don'ts

### Documentation Template

```markdown
# Component Name

Brief description of the component.

## Usage

When to use this component...

## Examples

### Web
\`\`\`javascript
<Component prop="value" />
\`\`\`

### iOS
\`\`\`swift
DSComponent(value: "text")
\`\`\`

### Android
\`\`\`kotlin
DSComponent(value = "text")
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Accessibility

- ARIA: ...
- Keyboard: ...
- Screen reader: ...

## Best Practices

### Do ✓
- ...

### Don't ✗
- ...
```

## Pull Request Process

### Before Submitting

1. **Run tests**: Ensure all tests pass
2. **Run linting**: Fix any linting errors
3. **Update docs**: If changing APIs or behavior
4. **Test manually**: On all supported platforms
5. **Check accessibility**: Use accessibility tools

### PR Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Accessibility tested
- [ ] Tested on all platforms
- [ ] Screenshots/videos attached (if UI change)

## Screenshots
[If applicable]

## Related Issues
Fixes #[issue number]
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Design review** for new components or visual changes
4. **Accessibility review** for UI changes
5. **Approval** required before merge

## Style Guidelines

### Code Style

#### Web (JavaScript/TypeScript)

```javascript
// Use consistent formatting
export function MyComponent({ variant = 'primary', size = 'medium' }) {
  return (
    <button className={`button button--${variant} button--${size}`}>
      Click me
    </button>
  );
}
```

#### iOS (Swift)

```swift
// Follow Swift API Design Guidelines
struct DSButton: View {
    let title: String
    var variant: Variant = .primary
    var size: Size = .medium
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
        }
        .buttonStyle(DSButtonStyle(variant: variant, size: size))
    }
}
```

#### Android (Kotlin)

```kotlin
// Follow Kotlin coding conventions
@Composable
fun DSButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Primary,
    size: ButtonSize = ButtonSize.Medium
) {
    Button(
        onClick = onClick,
        modifier = modifier
    ) {
        Text(text)
    }
}
```

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(button): add loading state
fix(input): resolve focus outline issue
docs(readme): update installation instructions
```

### Branch Naming

```
type/short-description
```

Examples:
- `feat/add-tooltip-component`
- `fix/button-loading-state`
- `docs/update-getting-started`

## Versioning

We use Semantic Versioning (SemVer):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features (backwards compatible)
- **Patch** (0.0.1): Bug fixes

## Questions?

- Join our Slack channel: #design-system
- Email: design-system@vibecaas.com
- Create a discussion on GitHub

Thank you for contributing to VibeCaaS Design System! 🎉
